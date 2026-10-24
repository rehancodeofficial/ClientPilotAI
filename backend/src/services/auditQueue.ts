/**
 * Background enrichment + audit queue.
 *
 * Discovery can insert a hundred leads in one request. Processing each of them
 * inline would hold the HTTP response open for minutes, and firing all the
 * outbound requests at once would open a hundred simultaneous connections and
 * look like a scraper to every host involved.
 *
 * This module keeps a single in-process queue drained by a small number of
 * workers, so discovery returns immediately and the details land shortly
 * after. Each job runs two steps for one lead, in this order:
 *
 *   1. Contact enrichment — resolves the business's website (OSM tag,
 *      Wikidata, or a verified name-based domain) and reads it for an email,
 *      a phone number and social profiles.
 *   2. The digital audit — now able to examine the site enrichment found.
 *
 * The order matters. Enrichment used to run only when the user pressed
 * "prepare" on a single lead, so a freshly discovered lead had no email, and
 * the audit judged "no website" for every business whose site OSM had simply
 * never recorded. Both steps now run for every discovered lead automatically.
 *
 * It is deliberately in-memory: a restart loses pending work, and the
 * `POST /api/audits/run-all` endpoint (or `scripts/backfill-audits.ts`) exists
 * to pick up anything that was missed.
 */

import { supabaseAdmin } from '../lib/supabase';
import { performDigitalAudit } from './audit';
import { enrichLeadContact } from './enrichment';
import { reverseGeocodeCountry } from './osm';

interface QueuedLead {
  workspaceId: string;
  leadId: string;
}

const MAX_WORKERS = 3;
const MAX_QUEUE = 500;

const queue: QueuedLead[] = [];
const queued = new Set<string>();
let activeWorkers = 0;

/**
 * The lead's ISO country code, looked up from its coordinates if need be.
 *
 * The resolver uses it to decide which country TLDs to try, and getting it
 * wrong is not neutral: with no country, a London business is only ever
 * checked on `.com`, so the `.co.uk` site it actually runs is never found.
 * Leads discovered since this became part of discovery already carry it; the
 * lookup is for the ones stored before that.
 */
async function countryCodeFor(
  lead: Record<string, unknown>,
  rawTags: Record<string, unknown>
): Promise<string | null> {
  const tagged = rawTags['addr:country'] ?? rawTags['clientpilot:country'];
  if (typeof tagged === 'string' && tagged.trim().length >= 2) return tagged.trim().toLowerCase();

  const lat = Number(lead.lat);
  const lng = Number(lead.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return reverseGeocodeCountry(lat, lng);
}

/**
 * Fills in a lead's website and contact details.
 *
 * Returns the website to audit, which may be one the lead did not have when it
 * was discovered. Enrichment that has already run is not repeated, so a
 * re-queued lead costs nothing.
 */
async function enrichLead(
  { workspaceId, leadId }: QueuedLead,
  lead: Record<string, unknown>
): Promise<string | null> {
  const existingUrl = (lead.website_url as string | null) || (lead.website as string | null) || null;

  if (lead.last_enrichment_run_at) return existingUrl;

  const rawTags = (lead.raw_osm_tags as Record<string, unknown>) || {};
  const countryCode = await countryCodeFor(lead, rawTags);

  const enrichment = await enrichLeadContact({
    name: lead.business_name as string,
    websiteUrl: existingUrl,
    rawOsmTags: rawTags,
    countryCode,
  });

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { last_enrichment_run_at: now };

  // A website the resolver found is as real as one OSM tagged, and both the
  // audit and the "has a website" badge read these two columns.
  if (enrichment.website) {
    updates.website_url = enrichment.website;
    updates.website = enrichment.website;
    updates.has_website = true;
  }

  // Never overwrite an address the user verified by hand.
  if (enrichment.email && lead.contact_source !== 'manual') {
    updates.contact_email = enrichment.email;
    updates.contact_source = enrichment.source;
    updates.contact_confidence = enrichment.confidence;
  }

  if (enrichment.phone) {
    if (!lead.contact_phone) updates.contact_phone = enrichment.phone;
    if (!lead.phone) updates.phone = enrichment.phone;
  }

  // `leads` has no column for socials or for how the website was established,
  // so they live alongside the OSM tags that produced them. Namespaced to keep
  // them distinguishable from genuine OSM keys.
  const enrichedTags: Record<string, unknown> = { ...rawTags };
  if (countryCode) enrichedTags['clientpilot:country'] = countryCode;
  if (Object.keys(enrichment.socialLinks).length > 0) {
    enrichedTags['clientpilot:social'] = enrichment.socialLinks;
  }
  if (enrichment.websiteSource) {
    enrichedTags['clientpilot:website_source'] = enrichment.websiteSource;
  }
  enrichedTags['clientpilot:website_reachable'] = enrichment.websiteReachable;
  updates.raw_osm_tags = enrichedTags;

  const { error: updateError } = await supabaseAdmin
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .eq('workspace_id', workspaceId);

  if (updateError) {
    console.warn(`[AuditQueue] Could not save enrichment for ${leadId}: ${updateError.message}`);
    return enrichment.website || existingUrl;
  }

  console.log(
    `[AuditQueue] Enriched "${lead.business_name}" — website: ${enrichment.website ?? 'none'}` +
      `${enrichment.websiteSource ? ` (${enrichment.websiteSource})` : ''}` +
      ` | email: ${enrichment.email ?? 'none'} | phone: ${enrichment.phone ?? 'none'}`
  );

  return enrichment.website || existingUrl;
}

/** Enriches and audits one lead, writing both results. */
async function runAudit({ workspaceId, leadId }: QueuedLead): Promise<void> {
  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('workspace_id', workspaceId)
    .single();

  if (error || !lead) return;

  let websiteUrl: string | null = lead.website_url || lead.website || null;
  try {
    websiteUrl = await enrichLead({ workspaceId, leadId }, lead);
  } catch (err: unknown) {
    console.warn(
      `[AuditQueue] Enrichment failed for ${leadId}:`,
      err instanceof Error ? err.message : err
    );
  }

  const result = await performDigitalAudit(
    lead.business_name,
    lead.category,
    websiteUrl,
    lead.phone || lead.contact_phone,
    lead.rating ?? null,
    lead.review_count ?? null,
    lead.raw_osm_tags as Record<string, unknown>
  );

  const { error: upsertError } = await supabaseAdmin.from('business_audits').upsert(
    {
      workspace_id: workspaceId,
      lead_id: leadId,
      website_exists: result.websiteExists,
      https_enabled: result.httpsEnabled,
      mobile_indicator: result.mobileIndicator,
      booking_detected: result.bookingDetected,
      ordering_detected: result.orderingDetected,
      contact_form_detected: result.contactFormDetected,
      social_presence_detected: result.socialPresenceDetected,
      digital_maturity_level: result.digitalMaturityLevel,
      audit_score: result.auditScore,
      audit_data: result.auditData,
      evidence: result.evidence,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'workspace_id,lead_id' }
  );

  if (upsertError) {
    console.warn(`[AuditQueue] Could not save audit for ${leadId}: ${upsertError.message}`);
    return;
  }

  await supabaseAdmin.from('outcome_events').insert({
    workspace_id: workspaceId,
    lead_id: leadId,
    event_type: 'audited',
    source: 'system_pipeline',
    notes:
      result.auditData.websiteHealthScore !== null
        ? `Automatic website audit: ${result.auditData.websiteHealthScore}/100 (grade ${result.auditData.websiteGrade}).`
        : 'Automatic audit completed — no reachable website found.',
  });
}

async function worker(): Promise<void> {
  while (queue.length > 0) {
    const job = queue.shift();
    if (!job) break;
    queued.delete(`${job.workspaceId}:${job.leadId}`);
    try {
      await runAudit(job);
    } catch (err: unknown) {
      console.warn(
        `[AuditQueue] Audit failed for ${job.leadId}:`,
        err instanceof Error ? err.message : err
      );
    }
  }
  activeWorkers -= 1;
}

function drain(): void {
  while (activeWorkers < MAX_WORKERS && queue.length > activeWorkers) {
    activeWorkers += 1;
    void worker();
  }
}

/**
 * Schedules audits for freshly discovered leads.
 *
 * Returns immediately; duplicates already in the queue are ignored, and the
 * queue is capped so a runaway discovery cannot exhaust memory.
 */
export function enqueueAudits(workspaceId: string, leadIds: string[]): void {
  for (const leadId of leadIds) {
    const key = `${workspaceId}:${leadId}`;
    if (queued.has(key)) continue;
    if (queue.length >= MAX_QUEUE) {
      console.warn('[AuditQueue] Queue is full; remaining leads can be audited via /api/audits/run-all.');
      break;
    }
    queued.add(key);
    queue.push({ workspaceId, leadId });
  }
  drain();
}

/** Queue depth, for the health endpoint and tests. */
export const auditQueueDepth = (): number => queue.length;
