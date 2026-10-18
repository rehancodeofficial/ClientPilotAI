import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/activity?limit=20&before=
// Server-side union of outcome_events, pipeline_stages, outreach_messages, and proposals
router.get('/', async (req, res) => {
  const user = req.user!;
  const limit = Math.min(50, Math.max(5, parseInt((req.query.limit as string) || '20', 10)));
  const before = req.query.before as string | undefined;

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .maybeSingle();

    if (!profile?.workspace_id) {
      return res.status(403).json({ error: 'No workspace found' });
    }

    const workspaceId = profile.workspace_id;

    // 1. Fetch leads for lead name resolution
    const { data: leads } = await supabaseAdmin
      .from('leads')
      .select('id, business_name')
      .eq('workspace_id', workspaceId);

    const leadNameMap = new Map<string, string>();
    (leads || []).forEach((l) => leadNameMap.set(l.id, l.business_name));

    // 2. Fetch latest outcome events
    let outcomesQuery = supabaseAdmin
      .from('outcome_events')
      .select('id, lead_id, event_type, event_date, notes')
      .order('event_date', { ascending: false })
      .limit(limit);

    if (before) outcomesQuery = outcomesQuery.lt('event_date', before);
    const { data: outcomes } = await outcomesQuery;

    // 3. Fetch latest pipeline stages
    let stagesQuery = supabaseAdmin
      .from('pipeline_stages')
      .select('id, lead_id, stage, changed_at')
      .eq('workspace_id', workspaceId)
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (before) stagesQuery = stagesQuery.lt('changed_at', before);
    const { data: stages } = await stagesQuery;

    // 4. Fetch latest outreach messages
    let outreachQuery = supabaseAdmin
      .from('outreach_messages')
      .select('id, lead_id, subject, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) outreachQuery = outreachQuery.lt('created_at', before);
    const { data: outreach } = await outreachQuery;

    // 5. Fetch latest proposal status changes
    let proposalsQuery = supabaseAdmin
      .from('proposals')
      .select('id, lead_id, title, status, updated_at')
      .eq('workspace_id', workspaceId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (before) proposalsQuery = proposalsQuery.lt('updated_at', before);
    const { data: proposals } = await proposalsQuery;

    // Normalize and union
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description?: string;
      timestamp: string;
      leadId?: string;
      leadName?: string;
    }> = [];

    (outcomes || []).forEach((o) => {
      activities.push({
        id: `outcome-${o.id}`,
        type: 'outcome_event',
        title: `Outcome: ${o.event_type.replace(/_/g, ' ')}`,
        description: o.notes || undefined,
        timestamp: o.event_date,
        leadId: o.lead_id,
        leadName: leadNameMap.get(o.lead_id),
      });
    });

    (stages || []).forEach((s) => {
      activities.push({
        id: `stage-${s.id}`,
        type: 'pipeline_stage',
        title: `Moved to ${s.stage} stage`,
        timestamp: s.changed_at,
        leadId: s.lead_id,
        leadName: leadNameMap.get(s.lead_id),
      });
    });

    (outreach || []).forEach((m) => {
      if (leadNameMap.has(m.lead_id)) {
        activities.push({
          id: `outreach-${m.id}`,
          type: 'outreach_sent',
          title: `Outreach ${m.status || 'drafted'}: "${m.subject || 'Follow-up'}"`,
          timestamp: m.created_at,
          leadId: m.lead_id,
          leadName: leadNameMap.get(m.lead_id),
        });
      }
    });

    (proposals || []).forEach((p) => {
      activities.push({
        id: `proposal-${p.id}`,
        type: 'proposal_status',
        title: `Proposal ${p.status}: "${p.title}"`,
        timestamp: p.updated_at,
        leadId: p.lead_id,
        leadName: leadNameMap.get(p.lead_id),
      });
    });

    // Sort combined by timestamp descending and slice to limit
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const result = activities.slice(0, limit);

    res.json({
      activities: result,
      nextCursor: result.length === limit ? result[result.length - 1].timestamp : null,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

export default router;
