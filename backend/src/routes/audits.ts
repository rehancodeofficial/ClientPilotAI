import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { performDigitalAudit } from '../services/audit';

const router = Router();

// GET /api/audits/:leadId
router.get('/:leadId', async (req, res) => {
  const user = req.user!;
  const { leadId } = req.params;

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .single();

    if (!profile?.workspace_id) return res.status(403).json({ error: 'No workspace found' });

    const { data: audit, error } = await supabaseAdmin
      .from('business_audits')
      .select('*')
      .eq('workspace_id', profile.workspace_id)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error) throw error;
    if (!audit) return res.status(404).json({ error: 'Audit not found for this lead' });

    res.json(audit);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// POST /api/audits/:leadId/run
router.post('/:leadId/run', async (req, res) => {
  const user = req.user!;
  const { leadId } = req.params;

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .single();

    if (!profile?.workspace_id) return res.status(403).json({ error: 'No workspace found' });

    // 1. Fetch Lead
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('workspace_id', profile.workspace_id)
      .single();

    if (leadErr || !lead) return res.status(404).json({ error: 'Lead not found in your workspace' });

    // 2. Perform Audit
    const auditResult = await performDigitalAudit(
      lead.business_name,
      lead.category,
      lead.website_url || lead.website,
      lead.phone || lead.contact_phone,
      lead.rating,
      lead.review_count,
      lead.raw_osm_tags as Record<string, unknown>
    );

    // 3. Upsert into business_audits
    const auditRow = {
      workspace_id: profile.workspace_id,
      lead_id: leadId,
      website_exists: auditResult.websiteExists,
      https_enabled: auditResult.httpsEnabled,
      mobile_indicator: auditResult.mobileIndicator,
      booking_detected: auditResult.bookingDetected,
      ordering_detected: auditResult.orderingDetected,
      contact_form_detected: auditResult.contactFormDetected,
      social_presence_detected: auditResult.socialPresenceDetected,
      digital_maturity_level: auditResult.digitalMaturityLevel,
      audit_score: auditResult.auditScore,
      audit_data: auditResult.auditData,
      evidence: auditResult.evidence,
      updated_at: new Date().toISOString(),
    };

    const { data: savedAudit, error: upsertErr } = await supabaseAdmin
      .from('business_audits')
      .upsert(auditRow, { onConflict: 'workspace_id,lead_id' })
      .select()
      .single();

    if (upsertErr) throw upsertErr;

    // Log an outcome event: 'audited'
    await supabaseAdmin.from('outcome_events').insert({
      workspace_id: profile.workspace_id,
      lead_id: leadId,
      event_type: 'audited',
      source: 'system_pipeline',
      notes: `Digital audit completed. Maturity: Level ${auditResult.digitalMaturityLevel}, Audit Score: ${auditResult.auditScore}/100.`,
    });

    res.json(savedAudit);
  } catch (err: unknown) {
    console.error('[Audits:Run] Error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

export default router;
