import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

const LogOutcomeSchema = z.object({
  eventType: z.enum([
    'discovered',
    'audited',
    'qualified',
    'contacted',
    'replied',
    'meeting_booked',
    'proposal_sent',
    'accepted',
    'rejected',
    'won',
    'lost'
  ]),
  source: z.enum(['user_action', 'system_pipeline', 'email_outreach']).default('user_action'),
  notes: z.string().trim().optional(),
});

// GET /api/outcomes/timeline - Recent outcome events across workspace
router.get('/timeline', async (req, res) => {
  const user = req.user!;
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .single();

    if (!profile?.workspace_id) return res.status(403).json({ error: 'No workspace found' });

    const { data: events, error } = await supabaseAdmin
      .from('outcome_events')
      .select(`
        *,
        leads (
          business_name,
          category,
          city
        )
      `)
      .eq('workspace_id', profile.workspace_id)
      .order('event_date', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(events);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// GET /api/outcomes/:leadId - Outcome history for a single lead
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

    const { data: events, error } = await supabaseAdmin
      .from('outcome_events')
      .select('*')
      .eq('workspace_id', profile.workspace_id)
      .eq('lead_id', leadId)
      .order('event_date', { ascending: true });

    if (error) throw error;
    res.json(events);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// POST /api/outcomes/:leadId - Record a new outcome event
router.post('/:leadId', async (req, res) => {
  const user = req.user!;
  const { leadId } = req.params;

  try {
    const { eventType, source, notes } = LogOutcomeSchema.parse(req.body);

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .single();

    if (!profile?.workspace_id) return res.status(403).json({ error: 'No workspace found' });

    const eventRow = {
      workspace_id: profile.workspace_id,
      lead_id: leadId,
      event_type: eventType,
      event_date: new Date().toISOString(),
      source,
      notes: notes || `Recorded outcome transition to "${eventType}".`,
    };

    const { data: saved, error } = await supabaseAdmin
      .from('outcome_events')
      .insert(eventRow)
      .select()
      .single();

    if (error) throw error;

    // Synchronize pipeline stage if the outcome corresponds to one
    let targetStage: string | null = null;
    if (eventType === 'qualified') targetStage = 'qualified';
    else if (eventType === 'contacted' || eventType === 'replied') targetStage = 'contacted';
    else if (eventType === 'won' || eventType === 'accepted') targetStage = 'client';

    if (targetStage) {
      await supabaseAdmin.from('pipeline_stages').insert({
        workspace_id: profile.workspace_id,
        lead_id: leadId,
        stage: targetStage,
        changed_by: user.sub,
      });
    }

    res.json(saved);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid outcome event payload', details: err.issues });
    }
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

export default router;
