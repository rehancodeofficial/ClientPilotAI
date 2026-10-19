/**
 * /api/messages — the workspace's outreach message record.
 *
 * The Message Records page previously derived its table from whatever leads
 * happened to be in the frontend store, so opening it directly showed an
 * endless skeleton and navigating to it after a partial lead load showed a
 * partial history. This router is the single source of truth: every outreach
 * message in the workspace, newest first, with the business it belongs to.
 */

import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { respondWithError } from '../lib/errors';

const router = Router();

async function workspaceIdFor(userId: string): Promise<string | null> {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('workspace_id')
    .eq('id', userId)
    .single();
  return profile?.workspace_id ?? null;
}

const ListSchema = z.object({
  status: z.enum(['draft', 'approved', 'sent', 'failed', 'all']).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

// GET /api/messages — every outreach message in the workspace
router.get('/', async (req, res) => {
  try {
    const { status = 'all', limit = 200 } = ListSchema.parse(req.query);
    const workspaceId = await workspaceIdFor(req.user!.sub);
    if (!workspaceId) return res.status(403).json({ error: 'No workspace found' });

    // outreach_messages has no workspace_id column, so the workspace filter is
    // applied through the lead it belongs to.
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('id, business_name, category, city, contact_email, outreach_status, outreach_sent_at')
      .eq('workspace_id', workspaceId);

    if (leadsError) throw leadsError;

    const leadById = new Map((leads || []).map((lead) => [lead.id as string, lead]));
    if (leadById.size === 0) {
      return res.json({ messages: [], counts: { total: 0, draft: 0, sent: 0, approved: 0, failed: 0 } });
    }

    let query = supabaseAdmin
      .from('outreach_messages')
      .select('*')
      .in('lead_id', [...leadById.keys()])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') query = query.eq('status', status);

    const { data: rows, error } = await query;
    if (error) throw error;

    const messages = (rows || []).map((row) => {
      const lead = leadById.get(row.lead_id as string);
      return {
        id: row.id,
        leadId: row.lead_id,
        leadName: lead?.business_name ?? 'Unknown business',
        leadCategory: lead?.category ?? null,
        leadCity: lead?.city ?? null,
        recipientEmail: lead?.contact_email ?? null,
        subject: row.subject || '(no subject)',
        body: row.content || '',
        status: row.status || 'draft',
        variant: row.variant ?? 1,
        generatedByAi: row.generated_by_ai ?? false,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        sentAt: lead?.outreach_sent_at ?? null,
      };
    });

    const counts = messages.reduce(
      (acc, message) => {
        acc.total += 1;
        const key = message.status as keyof typeof acc;
        if (key in acc && key !== 'total') acc[key] += 1;
        return acc;
      },
      { total: 0, draft: 0, approved: 0, sent: 0, failed: 0 }
    );

    res.json({ messages, counts });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query', details: err.issues });
    }
    respondWithError(res, err, 'GET /api/messages');
  }
});

export default router;
