import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { respondWithError } from '../lib/errors';

const router = Router();

// GET /api/dashboard/summary
// Returns stat strip counts and 30-day sparkline trends in one round trip
router.get('/summary', async (req, res) => {
  const user = req.user!;

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

    // 1. Fetch leads count
    const { count: discoveredCount } = await supabaseAdmin
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    // 2. Fetch latest stage per lead
    const { data: stages } = await supabaseAdmin
      .from('pipeline_stages')
      .select('lead_id, stage, changed_at')
      .eq('workspace_id', workspaceId)
      .order('changed_at', { ascending: false });

    // Deduplicate latest stage per lead
    const latestStageMap = new Map<string, { stage: string; changed_at: string }>();
    if (stages) {
      for (const s of stages) {
        if (!latestStageMap.has(s.lead_id)) {
          latestStageMap.set(s.lead_id, { stage: s.stage, changed_at: s.changed_at });
        }
      }
    }

    let qualifiedCount = 0;
    let contactedCount = 0;
    let wonCount = 0;

    for (const item of latestStageMap.values()) {
      if (item.stage === 'qualified') qualifiedCount++;
      else if (item.stage === 'contacted') contactedCount++;
      else if (item.stage === 'client') wonCount++;
    }

    // 3. Generate 30-day sparkline bins from leads.created_at
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data: recentLeads } = await supabaseAdmin
      .from('leads')
      .select('created_at')
      .eq('workspace_id', workspaceId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // 30 buckets
    const sparklineDays = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(thirtyDaysAgo.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(5, 10); // MM-DD
    });

    const leadCountsByDay = new Map<string, number>();
    (recentLeads || []).forEach((l) => {
      const day = (l.created_at || '').slice(5, 10);
      leadCountsByDay.set(day, (leadCountsByDay.get(day) || 0) + 1);
    });

    const discoveredSparkline = sparklineDays.map((day) => ({
      date: day,
      value: leadCountsByDay.get(day) || 0,
    }));

    // 4. Proposals summary
    const { data: proposals } = await supabaseAdmin
      .from('proposals')
      .select('status')
      .eq('workspace_id', workspaceId);

    const proposalStatusCounts: Record<string, number> = {
      draft: 0,
      submitted: 0,
      reviewed: 0,
      replied: 0,
      accepted: 0,
      rejected: 0,
    };

    (proposals || []).forEach((p) => {
      if (p.status in proposalStatusCounts) {
        proposalStatusCounts[p.status]++;
      }
    });

    const totalProposals = proposals?.length || 0;
    const acceptedCount = proposalStatusCounts.accepted;
    const acceptRate = totalProposals > 0 ? Math.round((acceptedCount / totalProposals) * 100) : 0;
    const repliedCount = proposalStatusCounts.replied + proposalStatusCounts.accepted + proposalStatusCounts.rejected;
    const replyRate = proposalStatusCounts.submitted > 0 ? Math.round((repliedCount / proposalStatusCounts.submitted) * 100) : 0;

    res.json({
      metrics: {
        discovered: discoveredCount || 0,
        qualified: qualifiedCount,
        contacted: contactedCount,
        won: wonCount,
      },
      sparklines: {
        discovered: discoveredSparkline,
      },
      proposals: {
        total: totalProposals,
        statusCounts: proposalStatusCounts,
        acceptRate,
        replyRate,
      },
    });
  } catch (err: unknown) {
    respondWithError(res, err, 'GET /api/dashboard/summary');
  }
});

export default router;
