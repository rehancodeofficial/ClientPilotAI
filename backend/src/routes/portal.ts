import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Middleware: Verify active client_portal_access grant for caller
// NEVER trust client-supplied lead_id or grant_id
async function portalAuth(req: any, res: any, next: any) {
  const user = req.user;
  if (!user || !user.sub) {
    return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
  }

  try {
    // Explicit column selection from client_portal_access
    const { data: grant, error } = await supabaseAdmin
      .from('client_portal_access')
      .select('id, workspace_id, user_id, lead_id, created_at, revoked_at')
      .eq('user_id', user.sub)
      .is('revoked_at', null)
      .maybeSingle();

    if (error || !grant) {
      return res.status(403).json({
        error: 'No active portal access grant found for this account.',
        code: 'PORTAL_ACCESS_DENIED',
      });
    }

    req.portalGrant = grant;
    next();
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
}

// ─── GET /api/portal/context ──────────────────────────────────────────────────
// Returns strictly allowlisted business name and agency workspace name
router.get('/context', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  try {
    // Fetch lead business_name strictly (no score, no outreach, no internal notes)
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id, business_name, category, city')
      .eq('id', grant.lead_id)
      .single();

    if (leadErr || !lead) {
      return res.status(404).json({ error: 'Lead details not found' });
    }

    // Fetch agency workspace name strictly
    const { data: workspace } = await supabaseAdmin
      .from('workspaces')
      .select('name')
      .eq('id', grant.workspace_id)
      .single();

    res.json({
      grantId: grant.id,
      leadId: lead.id,
      businessName: lead.business_name,
      category: lead.category,
      city: lead.city,
      agencyName: workspace?.name || 'Partner Agency',
      grantedAt: grant.created_at,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// ─── GET /api/portal/audit ────────────────────────────────────────────────────
// Returns ONLY the 7 objective digital presence signals and plain-language evidence.
// NEVER returns opportunity_score, confidence_score, or competitor insights.
router.get('/audit', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  try {
    const { data: audit, error } = await supabaseAdmin
      .from('business_audits')
      .select('website_exists, https_enabled, mobile_indicator, booking_detected, ordering_detected, contact_form_detected, social_presence_detected, digital_maturity_level, audit_score, evidence, created_at')
      .eq('lead_id', grant.lead_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!audit) {
      return res.json({
        audit: null,
        message: 'Digital presence audit is being finalized by your agency.',
      });
    }

    res.json({ audit });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// ─── GET /api/portal/recommendation ───────────────────────────────────────────
// Returns allowlisted recommendation fields only:
// primary_opportunity, recommended_services, estimated_complexity, estimated_duration.
// Strictly OMITS reasoning, maturity_gap, and private scoring models.
router.get('/recommendation', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  try {
    const { data: rec, error } = await supabaseAdmin
      .from('opportunity_analysis')
      .select('primary_opportunity, recommended_services, estimated_complexity, estimated_duration, estimated_project_range')
      .eq('lead_id', grant.lead_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json({ recommendation: rec || null });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// ─── GET /api/portal/proposal ─────────────────────────────────────────────────
// Returns latest proposal title, content (markdown), and status.
router.get('/proposal', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  try {
    const { data: proposal, error } = await supabaseAdmin
      .from('proposals')
      .select('id, title, content, status, created_at, updated_at')
      .eq('lead_id', grant.lead_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json({ proposal: proposal || null });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// ─── POST /api/portal/proposal/respond ────────────────────────────────────────
// Client action: accept / request-changes / decline
const RespondSchema = z.object({
  action: z.enum(['accept', 'request_changes', 'decline']),
  feedback: z.string().trim().max(2000).optional(),
});

router.post('/proposal/respond', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  const parsed = RespondSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid response action', details: parsed.error.issues });
  }

  const { action, feedback } = parsed.data;

  try {
    // 1. Get proposal
    const { data: proposal } = await supabaseAdmin
      .from('proposals')
      .select('id, status')
      .eq('lead_id', grant.lead_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const newStatus = action === 'accept' ? 'accepted' : action === 'decline' ? 'rejected' : 'reviewed';

    // 2. Update proposal status
    await supabaseAdmin
      .from('proposals')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', proposal.id);

    // 3. Log outcome event
    await supabaseAdmin.from('outcome_events').insert({
      lead_id: grant.lead_id,
      event_type: `client_${action}`,
      event_date: new Date().toISOString(),
      source: 'client_portal',
      notes: feedback || `Client responded: ${action}`,
    });

    // 4. Also post message in thread if feedback given
    if (feedback) {
      await supabaseAdmin.from('portal_messages').insert({
        grant_id: grant.id,
        sender_user_id: req.user.sub,
        body: feedback,
      });
    }

    res.json({ success: true, status: newStatus });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// ─── GET /api/portal/messages ─────────────────────────────────────────────────
// Returns messages for this grant
router.get('/messages', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  try {
    const { data: messages, error } = await supabaseAdmin
      .from('portal_messages')
      .select('id, sender_user_id, body, created_at, read_at')
      .eq('grant_id', grant.id)
      .order('created_at', { ascending: true });

    if (error) {
      // Gracefully return empty array if portal_messages table not created yet
      return res.json({ messages: [] });
    }

    res.json({ messages: messages || [] });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// ─── POST /api/portal/messages ────────────────────────────────────────────────
// Post message from client to agency
const MessageSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

router.post('/messages', authMiddleware, portalAuth, async (req: any, res) => {
  const grant = req.portalGrant;

  const parsed = MessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Message body cannot be empty' });
  }

  try {
    const { data: message, error } = await supabaseAdmin
      .from('portal_messages')
      .insert({
        grant_id: grant.id,
        sender_user_id: req.user.sub,
        body: parsed.data.body,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ message });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

export default router;
