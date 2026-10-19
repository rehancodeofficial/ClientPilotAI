/**
 * Background audit queue.
 *
 * Discovery can insert a hundred leads in one request. Auditing each of them
 * inline would hold the HTTP response open for minutes, and firing all the
 * audits at once would open a hundred simultaneous outbound connections and
 * look like a scraper to every host involved.
 *
 * This module keeps a single in-process queue drained by a small number of
 * workers, so discovery returns immediately and the audits land shortly after.
 * It is deliberately in-memory: a restart loses pending work, and the
 * `POST /api/audits/run-all` endpoint (or `scripts/backfill-audits.ts`) exists
 * to pick up anything that was missed.
 */

import { supabaseAdmin } from '../lib/supabase';
import { performDigitalAudit } from './audit';

interface QueuedLead {
  workspaceId: string;
  leadId: string;
}

const MAX_WORKERS = 3;
const MAX_QUEUE = 500;

const queue: QueuedLead[] = [];
const queued = new Set<string>();
let activeWorkers = 0;

/** Audits one lead and writes the result, including the outcome event. */
async function runAudit({ workspaceId, leadId }: QueuedLead): Promise<void> {
  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('workspace_id', workspaceId)
    .single();

  if (error || !lead) return;

  const result = await performDigitalAudit(
    lead.business_name,
    lead.category,
    lead.website_url || lead.website,
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
