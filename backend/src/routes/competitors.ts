import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { benchmarkCompetitors } from '../services/competitors';

const router = Router();

// GET /api/competitors/:leadId
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

    const { data: record, error } = await supabaseAdmin
      .from('competitor_analysis')
      .select('*')
      .eq('workspace_id', profile.workspace_id)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error) throw error;
    if (!record) return res.status(404).json({ error: 'Competitor analysis not found for this lead' });

    res.json(record);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// POST /api/competitors/:leadId/analyze
router.post('/:leadId/analyze', async (req, res) => {
  const user = req.user!;
  const { leadId } = req.params;

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .single();

    if (!profile?.workspace_id) return res.status(403).json({ error: 'No workspace found' });

    // 1. Fetch Target Lead
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('workspace_id', profile.workspace_id)
      .single();

    if (leadErr || !lead) return res.status(404).json({ error: 'Lead not found in your workspace' });

    // 2. Fetch Potential Peer Leads in the Workspace
    const { data: peerLeads } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('workspace_id', profile.workspace_id)
      .eq('category', lead.category);

    // 3. Check for existing audit on the target lead
    const { data: targetAudit } = await supabaseAdmin
      .from('business_audits')
      .select('digital_maturity_level, booking_detected')
      .eq('workspace_id', profile.workspace_id)
      .eq('lead_id', leadId)
      .maybeSingle();

    // 4. Run Benchmark
    const benchmarkResult = benchmarkCompetitors(
      {
        id: lead.id,
        name: lead.business_name,
        category: lead.category,
        websiteUrl: lead.website_url || lead.website,
        hasWebsite: lead.has_website,
        digitalMaturity: targetAudit?.digital_maturity_level,
        bookingDetected: targetAudit?.booking_detected === 'detected',
        rating: lead.rating,
        reviewCount: lead.review_count,
      },
      (peerLeads || []).map((p) => ({
        id: p.id,
        name: p.business_name,
        category: p.category,
        address: p.address,
        websiteUrl: p.website_url || p.website,
        hasWebsite: p.has_website,
        phone: p.phone || p.contact_phone,
        rating: p.rating,
        reviewCount: p.review_count,
      }))
    );

    // 5. Upsert into competitor_analysis
    const row = {
      workspace_id: profile.workspace_id,
      lead_id: leadId,
      competitor_data: benchmarkResult.competitors,
      competitive_gap: benchmarkResult.competitiveGaps,
      updated_at: new Date().toISOString(),
    };

    const { data: saved, error: saveErr } = await supabaseAdmin
      .from('competitor_analysis')
      .upsert(row, { onConflict: 'workspace_id,lead_id' })
      .select()
      .single();

    if (saveErr) throw saveErr;

    res.json(saved);
  } catch (err: unknown) {
    console.error('[Competitors:Analyze] Error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

export default router;
