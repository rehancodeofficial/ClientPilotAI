import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { performDigitalAudit } from '../services/audit';
import { auditWebsite, normalizeWebsiteUrl } from '../services/websiteAudit';
import { isSafePublicUrl } from '../lib/security';
import { respondWithError } from '../lib/errors';

const router = Router();

/** Resolves the caller's workspace, or null when the profile has none. */
async function workspaceIdFor(userId: string): Promise<string | null> {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('workspace_id')
    .eq('id', userId)
    .single();
  return profile?.workspace_id ?? null;
}

/** Builds the `business_audits` row for a completed audit. */
function auditRowFor(
  workspaceId: string,
  leadId: string,
  result: Awaited<ReturnType<typeof performDigitalAudit>>
) {
  return {
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
  };
}

/** Runs the audit for one lead row and persists it. Returns the saved row. */
async function auditLeadRow(workspaceId: string, lead: Record<string, any>) {
  const result = await performDigitalAudit(
    lead.business_name,
    lead.category,
    lead.website_url || lead.website,
    lead.phone || lead.contact_phone,
    lead.rating ?? null,
    lead.review_count ?? null,
    lead.raw_osm_tags as Record<string, unknown>
  );

  const { data: saved, error } = await supabaseAdmin
    .from('business_audits')
    .upsert(auditRowFor(workspaceId, lead.id, result), { onConflict: 'workspace_id,lead_id' })
    .select()
    .single();

  if (error) throw error;

  await supabaseAdmin.from('outcome_events').insert({
    workspace_id: workspaceId,
    lead_id: lead.id,
    event_type: 'audited',
    source: 'system_pipeline',
    notes:
      result.auditData.websiteHealthScore !== null
        ? `Website audit: ${result.auditData.websiteHealthScore}/100 (grade ${result.auditData.websiteGrade}), ${result.auditData.websiteAudit?.issues.length ?? 0} issues found. Digital maturity Level ${result.digitalMaturityLevel}.`
        : `Digital audit completed with no reachable website. Digital maturity Level ${result.digitalMaturityLevel}.`,
  });

  return saved;
}

// ─── GET /api/audits — every audit in the workspace ───────────────────────────

router.get('/', async (req, res) => {
  try {
    const workspaceId = await workspaceIdFor(req.user!.sub);
    if (!workspaceId) return res.status(403).json({ error: 'No workspace found' });

    const { data, error } = await supabaseAdmin
      .from('business_audits')
      .select('*, leads(business_name, category, city, website_url)')
      .eq('workspace_id', workspaceId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ audits: data || [] });
  } catch (err: unknown) {
    respondWithError(res, err, 'GET /api/audits');
  }
});

// ─── POST /api/audits/website — audit any URL, no lead required ───────────────

const WebsiteAuditSchema = z.object({
  url: z.string().min(3, 'A website address is required'),
});

router.post('/website', async (req, res) => {
  try {
    const { url } = WebsiteAuditSchema.parse(req.body);
    const normalized = normalizeWebsiteUrl(url);

    if (!normalized || !isSafePublicUrl(normalized)) {
      return res.status(400).json({
        error: 'That address could not be audited. Enter a public website address, for example example.com.',
      });
    }

    const report = await auditWebsite(normalized);
    res.json(report);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: err.issues });
    }
    respondWithError(res, err, 'POST /api/audits/website');
  }
});

// ─── POST /api/audits/run-all — audit every un-audited lead ───────────────────
//
// Discovery can add hundreds of leads at once; this backfills their audits in
// bounded batches so the Market Intelligence and Zones views have real data.

const RunAllSchema = z.object({
  limit: z.number().int().min(1).max(200).optional(),
  /** Re-audit leads that already have a stored audit. */
  refresh: z.boolean().optional(),
});

router.post('/run-all', async (req, res) => {
  try {
    const { limit = 25, refresh = false } = RunAllSchema.parse(req.body ?? {});
    const workspaceId = await workspaceIdFor(req.user!.sub);
    if (!workspaceId) return res.status(403).json({ error: 'No workspace found' });

    let auditedLeadIds = new Set<string>();
    if (!refresh) {
      const { data: existing } = await supabaseAdmin
        .from('business_audits')
        .select('lead_id')
        .eq('workspace_id', workspaceId);
      auditedLeadIds = new Set((existing || []).map((row) => row.lead_id as string));
    }

    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const queue = (leads || [])
      .filter((lead) => !auditedLeadIds.has(lead.id))
      .slice(0, limit);

    // Four at a time: enough to be quick, few enough not to look like a scraper.
    const CONCURRENCY = 4;
    let audited = 0;
    let failed = 0;

    for (let i = 0; i < queue.length; i += CONCURRENCY) {
      const batch = queue.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((lead) => auditLeadRow(workspaceId, lead))
      );
      for (const result of results) {
        if (result.status === 'fulfilled') audited += 1;
        else {
          failed += 1;
          console.warn('[Audits:RunAll]', result.reason);
        }
      }
    }

    res.json({
      audited,
      failed,
      remaining: Math.max(0, (leads || []).length - auditedLeadIds.size - audited),
      totalLeads: (leads || []).length,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: err.issues });
    }
    respondWithError(res, err, 'POST /api/audits/run-all');
  }
});

// ─── GET /api/audits/:leadId ──────────────────────────────────────────────────

router.get('/:leadId', async (req, res) => {
  const { leadId } = req.params;

  try {
    const workspaceId = await workspaceIdFor(req.user!.sub);
    if (!workspaceId) return res.status(403).json({ error: 'No workspace found' });

    const { data: audit, error } = await supabaseAdmin
      .from('business_audits')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error) throw error;
    if (!audit) return res.status(404).json({ error: 'Audit not found for this lead' });

    res.json(audit);
  } catch (err: unknown) {
    respondWithError(res, err, 'GET /api/audits/:leadId');
  }
});

// ─── POST /api/audits/:leadId/run ─────────────────────────────────────────────

router.post('/:leadId/run', async (req, res) => {
  const { leadId } = req.params;

  try {
    const workspaceId = await workspaceIdFor(req.user!.sub);
    if (!workspaceId) return res.status(403).json({ error: 'No workspace found' });

    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('workspace_id', workspaceId)
      .single();

    if (leadErr || !lead) return res.status(404).json({ error: 'Lead not found in your workspace' });

    const saved = await auditLeadRow(workspaceId, lead);
    res.json(saved);
  } catch (err: unknown) {
    console.error('[Audits:Run] Error:', err);
    respondWithError(res, err, 'POST /api/audits/:leadId/run');
  }
});

export default router;
export { auditLeadRow };
