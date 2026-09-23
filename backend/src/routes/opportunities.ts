import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { performDigitalAudit, BusinessAuditResult } from '../services/audit';
import { analyzeBusinessOpportunity } from '../services/opportunity';

const router = Router();

// GET /api/opportunities/zones - Aggregates leads into geographic opportunity zones
router.get('/zones', async (req, res) => {
  const user = req.user!;
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .single();

    if (!profile?.workspace_id) return res.status(403).json({ error: 'No workspace found' });

    // Fetch leads and their opportunity analyses
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select(`
        id,
        business_name,
        category,
        address,
        city,
        lat,
        lng,
        opportunity_analysis (
          opportunity_score,
          current_maturity_level,
          confidence_score
        )
      `)
      .eq('workspace_id', profile.workspace_id);

    if (error) throw error;

    // Cluster leads into zones by city and address keywords
    const zoneMap = new Map<string, {
      zoneName: string;
      latSum: number;
      lngSum: number;
      count: number;
      scores: number[];
      maturities: number[];
      categories: string[];
      highPriorityCount: number;
    }>();

    (leads || []).forEach((l) => {
      // Determine zone label
      let zoneName = l.city || 'Karachi Metro';
      const addr = (l.address || '').toLowerCase();
      if (addr.includes('clifton')) zoneName = `${l.city || 'Karachi'} - Clifton`;
      else if (addr.includes('dha') || addr.includes('defence')) zoneName = `${l.city || 'Karachi'} - DHA`;
      else if (addr.includes('gulshan')) zoneName = `${l.city || 'Karachi'} - Gulshan`;
      else if (addr.includes('gulberg')) zoneName = `${l.city || 'Lahore'} - Gulberg`;
      else if (addr.includes('f-7') || addr.includes('f-6') || addr.includes('blue area')) zoneName = `${l.city || 'Islamabad'} - Blue Area`;
      else if (addr.includes('saddar')) zoneName = `${l.city || 'Karachi'} - Saddar`;

      const analysis = Array.isArray(l.opportunity_analysis)
        ? l.opportunity_analysis[0]
        : (l.opportunity_analysis as any);

      const score = analysis?.opportunity_score ?? 75;
      const maturity = analysis?.current_maturity_level ?? 1;

      const current: {
        zoneName: string;
        latSum: number;
        lngSum: number;
        count: number;
        scores: number[];
        maturities: number[];
        categories: string[];
        highPriorityCount: number;
      } = zoneMap.get(zoneName) || {
        zoneName,
        latSum: 0,
        lngSum: 0,
        count: 0,
        scores: [],
        maturities: [],
        categories: [],
        highPriorityCount: 0,
      };

      current.count += 1;
      current.latSum += l.lat || (l.city === 'Lahore' ? 31.5204 : l.city === 'Islamabad' ? 33.6844 : 24.8607);
      current.lngSum += l.lng || (l.city === 'Lahore' ? 74.3587 : l.city === 'Islamabad' ? 73.0479 : 67.0011);
      current.scores.push(score);
      current.maturities.push(maturity);
      current.categories.push(l.category);
      if (score >= 80) current.highPriorityCount += 1;

      zoneMap.set(zoneName, current);
    });

    const zones = Array.from(zoneMap.values()).map((z) => {
      const avgScore = Math.round(z.scores.reduce((a, b) => a + b, 0) / z.count);
      const avgMaturity = Number((z.maturities.reduce((a, b) => a + b, 0) / z.count).toFixed(1));

      // Find top category
      const catCount = new Map<string, number>();
      z.categories.forEach((c) => catCount.set(c, (catCount.get(c) || 0) + 1));
      let topCat = 'restaurant';
      let maxCatCount = 0;
      catCount.forEach((cnt, cat) => {
        if (cnt > maxCatCount) {
          maxCatCount = cnt;
          topCat = cat;
        }
      });

      return {
        zoneName: z.zoneName,
        centerLat: Number((z.latSum / z.count).toFixed(4)),
        centerLng: Number((z.lngSum / z.count).toFixed(4)),
        totalOpportunities: z.count,
        avgOpportunityScore: avgScore,
        avgMaturityLevel: avgMaturity,
        topCategory: topCat,
        highPriorityCount: z.highPriorityCount,
      };
    });

    res.json(zones);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// GET /api/opportunities/:leadId
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

    const { data: opp, error } = await supabaseAdmin
      .from('opportunity_analysis')
      .select('*')
      .eq('workspace_id', profile.workspace_id)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error) throw error;
    if (!opp) return res.status(404).json({ error: 'Opportunity analysis not found for this lead' });

    res.json(opp);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

// POST /api/opportunities/:leadId/analyze
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

    // 1. Fetch Lead
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('workspace_id', profile.workspace_id)
      .single();

    if (leadErr || !lead) return res.status(404).json({ error: 'Lead not found in your workspace' });

    // 2. Fetch or Run Digital Audit
    let auditData: BusinessAuditResult;
    const { data: existingAudit } = await supabaseAdmin
      .from('business_audits')
      .select('*')
      .eq('workspace_id', profile.workspace_id)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (existingAudit) {
      auditData = {
        websiteExists: existingAudit.website_exists,
        httpsEnabled: existingAudit.https_enabled,
        mobileIndicator: existingAudit.mobile_indicator,
        bookingDetected: existingAudit.booking_detected,
        orderingDetected: existingAudit.ordering_detected,
        contactFormDetected: existingAudit.contact_form_detected,
        socialPresenceDetected: existingAudit.social_presence_detected,
        digitalMaturityLevel: existingAudit.digital_maturity_level,
        auditScore: existingAudit.audit_score,
        auditData: existingAudit.audit_data,
        evidence: existingAudit.evidence,
      };
    } else {
      auditData = await performDigitalAudit(
        lead.business_name,
        lead.category,
        lead.website_url || lead.website,
        lead.phone || lead.contact_phone,
        lead.rating,
        lead.review_count,
        lead.raw_osm_tags as Record<string, unknown>
      );

      // Save the generated audit
      await supabaseAdmin.from('business_audits').upsert({
        workspace_id: profile.workspace_id,
        lead_id: leadId,
        website_exists: auditData.websiteExists,
        https_enabled: auditData.httpsEnabled,
        mobile_indicator: auditData.mobileIndicator,
        booking_detected: auditData.bookingDetected,
        ordering_detected: auditData.orderingDetected,
        contactFormDetected: auditData.contactFormDetected,
        social_presence_detected: auditData.socialPresenceDetected,
        digital_maturity_level: auditData.digitalMaturityLevel,
        audit_score: auditData.auditScore,
        audit_data: auditData.auditData,
        evidence: auditData.evidence,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'workspace_id,lead_id' });
    }

    // 3. Analyze Business Opportunity
    const oppResult = await analyzeBusinessOpportunity(
      {
        id: lead.id,
        name: lead.business_name,
        category: lead.category,
        address: lead.address || '',
        city: lead.city || 'Karachi',
        phone: lead.phone || lead.contact_phone,
        rating: lead.rating,
        reviewCount: lead.review_count,
        websiteUrl: lead.website_url || lead.website,
      },
      auditData
    );

    // 4. Save into opportunity_analysis table
    const oppRow = {
      workspace_id: profile.workspace_id,
      lead_id: leadId,
      opportunity_score: oppResult.opportunityScore,
      confidence_score: oppResult.confidenceScore,
      digital_gap_score: oppResult.dimensions.digitalGap,
      category_fit_score: oppResult.dimensions.categoryFit,
      review_activity_score: oppResult.dimensions.reviewActivity,
      market_density_score: oppResult.dimensions.marketDensity,
      competitor_presence_score: oppResult.dimensions.competitorPresence,
      commercial_potential_score: oppResult.dimensions.commercialPotential,
      business_need_score: oppResult.dimensions.businessNeed,
      current_maturity_level: oppResult.currentMaturityLevel,
      target_maturity_level: oppResult.targetMaturityLevel,
      maturity_gap: oppResult.maturityGap,
      primary_opportunity: oppResult.primaryOpportunity,
      secondary_opportunities: oppResult.secondaryOpportunities,
      recommended_services: oppResult.recommendedServices,
      estimated_complexity: oppResult.estimatedScope.complexity,
      estimated_duration: oppResult.estimatedScope.duration,
      estimated_project_range: oppResult.estimatedScope.preliminaryInvestmentRange,
      reasoning: oppResult.reasoning,
      evidence: oppResult.evidence,
      recommended_next_action: oppResult.recommendedNextAction,
      updated_at: new Date().toISOString(),
    };

    const { data: savedOpp, error: oppSaveErr } = await supabaseAdmin
      .from('opportunity_analysis')
      .upsert(oppRow, { onConflict: 'workspace_id,lead_id' })
      .select()
      .single();

    if (oppSaveErr) throw oppSaveErr;

    // 5. Update lead_scores table for backward compatibility with existing views
    await supabaseAdmin.from('lead_scores').upsert({
      lead_id: leadId,
      overall_score: oppResult.opportunityScore,
      digital_presence_gap: oppResult.dimensions.digitalGap,
      category_fit: oppResult.dimensions.categoryFit,
      review_activity: oppResult.dimensions.reviewActivity,
      market_density: oppResult.dimensions.marketDensity,
      competitor_presence: oppResult.dimensions.competitorPresence,
      ai_reasoning: oppResult.reasoning.join(' '),
      model_used: 'gemini-2.5-flash',
    }, { onConflict: 'lead_id' });

    res.json(savedOpp);
  } catch (err: unknown) {
    console.error('[Opportunities:Analyze] Error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
});

export default router;
