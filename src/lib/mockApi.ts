import { supabase } from './supabaseClient';
import type {
  Lead, DashboardStats, PipelineStage, OutreachMessage, ProgressStep, BusinessCategory,
  DigitalAudit, OpportunityAnalysis, CompetitorAnalysisResult, OpportunityZone,
  MarketIntelligenceStats, ModelEvaluationStats, OutcomeEvent, OutcomeEventType
} from '../types';
import { mockLeads, mockDashboardStats } from '../data/mockLeads';
import { getCategoryLabel } from './utils';

let rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim();

if (import.meta.env.MODE === 'production') {
  // If the backend is on a different domain, it should be an absolute URL
  // If it's the same domain, we enforce '/api'
  if (rawApiUrl === '/' || rawApiUrl === '') {
    rawApiUrl = '/api';
  } else if (rawApiUrl.includes('localhost')) {
    rawApiUrl = '/api';
  }
}

// Ensure the URL correctly points to the api endpoint without trailing slashes
if (rawApiUrl.startsWith('http')) {
  if (rawApiUrl.endsWith('/')) {
    rawApiUrl = rawApiUrl.slice(0, -1);
  }
  if (!rawApiUrl.endsWith('/api')) {
    rawApiUrl += '/api';
  }
} else if (!rawApiUrl.startsWith('/api')) {
  rawApiUrl = '/api';
}

const API_URL = rawApiUrl;

// ============================================================
// Utility Helpers
// ============================================================
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(base: number, variance = 200): number {
  return base + Math.random() * variance - variance / 2;
}

const isProd = import.meta.env.MODE === 'production';
const forceDemo = import.meta.env.VITE_FORCE_DEMO === 'true';

function isDemoMode(session: unknown): boolean {
  if (isProd && !forceDemo) return false;
  const isEnvConfigured =
    !!import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co';
  return !session || !isEnvConfigured;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'API Error' }));
    throw new Error(err.error || response.statusText);
  }

  return response.json();
}

interface DbLead {
  id: string;
  business_name?: string;
  category?: string | null;
  address?: string;
  city?: string | null;
  phone?: string | null;
  rating?: number | null;
  review_count?: number | null;
  has_website?: boolean;
  website_url?: string | null;
  pipeline_stage?: PipelineStage;
  created_at?: string;
  distance?: number;
  lat?: number;
  lng?: number;
  // Enrichment fields
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  contact_source?: string | null;
  contact_confidence?: number | null;
  // Outreach draft fields
  outreach_subject?: string | null;
  outreach_body?: string | null;
  outreach_status?: string | null;
  outreach_generated_at?: string | null;
  outreach_sent_at?: string | null;
  // Proposal draft fields
  proposal_content?: string | null;
  proposal_status?: string | null;
  proposal_generated_at?: string | null;
  // Metadata
  last_enrichment_run_at?: string | null;
  last_error?: string | null;
  lead_scores?: {
    overall_score?: number;
    digital_presence_gap?: number;
    category_fit?: number;
    review_activity?: number;
    market_density?: number;
    competitor_presence?: number;
    ai_reasoning?: string;
  }[] | {
    overall_score?: number;
    digital_presence_gap?: number;
    category_fit?: number;
    review_activity?: number;
    market_density?: number;
    competitor_presence?: number;
    ai_reasoning?: string;
  };
  outreach_messages?: {
    id: string;
    subject?: string;
    content?: string;
    status?: 'draft' | 'sent';
    created_at?: string;
  }[];
}

const PIPELINE_STAGES: PipelineStage[] = ['discovery', 'qualified', 'contacted', 'client'];

function normalizePipelineStage(stage?: string | null): PipelineStage {
  return PIPELINE_STAGES.includes(stage as PipelineStage) ? (stage as PipelineStage) : 'discovery';
}

function normalizeBusinessCategory(category?: string | null): BusinessCategory {
  const normalized = (category || '').trim().toLowerCase();
  const supported: BusinessCategory[] = [
    'restaurant', 'retail', 'salon', 'clinic', 'auto_service', 'bakery', 'pharmacy',
    'tailor', 'cafe', 'gym', 'electronics', 'jewellery', 'real_estate', 'catering',
  ];

  if (supported.includes(normalized as BusinessCategory)) return normalized as BusinessCategory;

  // OSM returns a wide range of category names. Map unknown real-world values
  // to the closest frontend category instead of breaking Leads/Pipeline views.
  if (['fast_food', 'food_court', 'bar', 'pub'].includes(normalized)) return 'restaurant';
  if (['shop', 'supermarket', 'convenience', 'marketplace', 'mall', 'department_store'].includes(normalized)) return 'retail';
  if (['beauty', 'hairdresser', 'spa'].includes(normalized)) return 'salon';
  if (['doctors', 'dentist', 'hospital', 'medical_centre'].includes(normalized)) return 'clinic';
  if (['car_repair', 'car_wash', 'vehicle_inspection'].includes(normalized)) return 'auto_service';
  if (['fitness_centre', 'sports_centre'].includes(normalized)) return 'gym';

  return 'retail';
}

// Helper to map Supabase database records to frontend Lead interface
function mapDbLeadToLead(dbLead: DbLead): Lead {
  // lead_scores may come as array (joined query) or single object (upsert return)
  const scoresRaw = Array.isArray(dbLead.lead_scores) ? dbLead.lead_scores[0] : dbLead.lead_scores;
  const scores = scoresRaw || {};
  const hasWebsite = dbLead.has_website || false;
  const city = (dbLead.city || 'Karachi') as Lead['city'];
  const category = normalizeBusinessCategory(dbLead.category);

  return {
    id: dbLead.id,
    name: dbLead.business_name || 'Unknown Business',
    category,
    address: dbLead.address || '',
    city,
    phone: dbLead.phone || undefined,
    rating: dbLead.rating || undefined,
    reviewCount: dbLead.review_count || undefined,
    websiteStatus: hasWebsite ? 'has_website' : 'none',
    websiteUrl: dbLead.website_url || undefined,
    score: scores.overall_score || 0,
    scoreBreakdown: {
      digitalPresenceGap: scores.digital_presence_gap || 0,
      categoryFit: scores.category_fit || 0,
      reviewActivity: scores.review_activity || 0,
      marketDensity: scores.market_density || 0,
      competitorPresence: scores.competitor_presence || 0,
    },
    pipelineStage: normalizePipelineStage(dbLead.pipeline_stage),
    discoveredAt: dbLead.created_at || new Date().toISOString(),
    distance: dbLead.distance || undefined,
    aiAnalysis: scores.ai_reasoning || 'AI scoring and analysis in progress...',
    outreachMessages: (Array.isArray(dbLead.outreach_messages) 
      ? dbLead.outreach_messages 
      : dbLead.outreach_messages 
        ? [dbLead.outreach_messages] 
        : []
    ).filter(Boolean).map((msg: { id: string; subject?: string; content?: string; status?: 'draft' | 'sent'; created_at?: string }) => ({
      id: msg.id,
      subject: msg.subject || '',
      body: msg.content || '',
      status: msg.status || 'draft',
      createdAt: msg.created_at || new Date().toISOString(),
    })),
    latitude: dbLead.lat || undefined,
    longitude: dbLead.lng || undefined,
    // Enrichment fields
    contactEmail: dbLead.contact_email ?? undefined,
    contactPhone: dbLead.contact_phone ?? undefined,
    website: dbLead.website ?? undefined,
    contactSource: (dbLead.contact_source ?? undefined) as Lead['contactSource'],
    contactConfidence: dbLead.contact_confidence ?? undefined,
    // Outreach fields
    outreachSubject: dbLead.outreach_subject ?? undefined,
    outreachBody: dbLead.outreach_body ?? undefined,
    outreachStatus: (dbLead.outreach_status ?? undefined) as Lead['outreachStatus'],
    outreachGeneratedAt: dbLead.outreach_generated_at ?? undefined,
    outreachSentAt: dbLead.outreach_sent_at ?? undefined,
    // Proposal fields
    proposalContent: dbLead.proposal_content ?? undefined,
    proposalStatus: (dbLead.proposal_status ?? undefined) as Lead['proposalStatus'],
    proposalGeneratedAt: dbLead.proposal_generated_at ?? undefined,
    // Metadata
    lastEnrichmentRunAt: dbLead.last_enrichment_run_at ?? undefined,
    lastError: dbLead.last_error ?? null,
  };
}

// ============================================================
// Discovery Leads
// ============================================================
export async function discoverLeads(
  params: { location: string; categories: string[]; radiusKm: number; lat?: number; lng?: number },
  onProgress?: (steps: ProgressStep[]) => void
): Promise<{ leads: Lead[] }> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    const totalFound = Math.floor(Math.random() * 20) + 35; // 35-55
    const filteredCount = Math.floor(totalFound * 0.45) + 5;

    const steps: ProgressStep[] = [
      { id: '1', label: 'Geocoding location...', status: 'active' },
      { id: '2', label: 'Querying OpenStreetMap...', status: 'pending' },
      { id: '3', label: 'Initiating AI scoring pipeline...', status: 'pending' }
    ];

    if (onProgress) {
      onProgress([...steps]);
      await delay(jitter(800, 200));
      steps[0] = { ...steps[0], status: 'done' };
      steps[1] = { ...steps[1], status: 'active' };
      onProgress([...steps]);
      await delay(jitter(1000, 300));
      steps[1] = { ...steps[1], status: 'done' };
      steps[2] = { ...steps[2], status: 'active' };
      onProgress([...steps]);
      await delay(jitter(1200, 300));
      steps[2] = { ...steps[2], status: 'done' };
      onProgress([...steps]);
    }

    let results = [...mockLeads];
    if (params.categories.length > 0) {
      results = results.filter((l) => params.categories.includes(l.category));
      if (results.length === 0) results = mockLeads.slice(0, 12);
    }

    results = results.sort(() => Math.random() - 0.5).slice(0, Math.min(filteredCount, results.length));
    return { leads: results };
  }

  try {
    if (onProgress) {
      onProgress([
        { id: '1', label: 'Geocoding location...', status: 'active' },
        { id: '2', label: 'Querying OpenStreetMap...', status: 'pending' },
        { id: '3', label: 'Initiating AI scoring pipeline...', status: 'pending' }
      ]);
    }

    const result = await fetchWithAuth('/leads/discover', {
      method: 'POST',
      body: JSON.stringify({
        location: params.location,
        lat: params.lat,
        lng: params.lng,
        categories: params.categories,
        radiusMeters: params.radiusKm * 1000,
      }),
    }) as { leads: DbLead[]; [key: string]: unknown };

    if (onProgress) {
      onProgress([
        { id: '1', label: 'Geocoding location...', status: 'done' },
        { id: '2', label: 'Querying OpenStreetMap...', status: 'done' },
        { id: '3', label: 'Initiating AI scoring pipeline...', status: 'done' }
      ]);
    }

    return {
      ...result,
      leads: (result.leads || []).map(mapDbLeadToLead),
    };
  } catch (err) {
    console.warn('API discovery failed:', err);
    if (isProd && !forceDemo) throw err;
    if (onProgress) {
      onProgress([
        { id: '1', label: 'Geocoding location...', status: 'done' },
        { id: '2', label: 'Querying OpenStreetMap...', status: 'done' },
        { id: '3', label: 'Initiating AI scoring pipeline...', status: 'done' }
      ]);
    }
    await delay(jitter(500, 100));
    return { leads: mockLeads.slice(0, 8) };
  }
}

// ============================================================
// Trigger AI Scoring for a single lead (called when panel opens with score=0)
// ============================================================
export async function scoreLeadApi(leadId: string): Promise<Record<string, unknown> | null> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // ignore
  }

  if (isDemoMode(session)) return null; // mock leads already have scores

  try {
    const result = await fetchWithAuth(`/leads/${leadId}/score`, { method: 'POST' });
    return result as Record<string, unknown>;
  } catch (err) {
    console.warn('[scoreLeadApi] failed:', err);
    if (isProd && !forceDemo) throw err;
    return null;
  }
}

// ============================================================
// Get All Leads
// ============================================================
export async function getAllLeads(): Promise<Lead[]> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    throw new Error('Please sign in with a real account to view workspace leads. Demo mode does not use dummy lead data.');
  }

  try {
    const raw = (await fetchWithAuth('/leads')) as DbLead[];
    return raw.map(mapDbLeadToLead);
  } catch (err) {
    console.warn('getAllLeads API failed:', err);
    throw err;
  }
}

// ============================================================
// Dashboard Analytics overview
// ============================================================
export async function getDashboardStats(): Promise<DashboardStats> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    await delay(jitter(500, 150));
    return { ...mockDashboardStats };
  }

  try {
    return await fetchWithAuth('/analytics/overview');
  } catch (err) {
    console.warn('getDashboardStats API failed:', err);
    if (isProd && !forceDemo) throw err;
    await delay(jitter(400, 100));
    return { ...mockDashboardStats };
  }
}

// ============================================================
// Generate Outreach
// ============================================================
export async function generateOutreach(leadId: string): Promise<OutreachMessage> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    await delay(jitter(1200, 300));
    const lead = mockLeads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const hasOutreach = lead.outreachMessages && lead.outreachMessages.length > 0;
    const variant = hasOutreach ? ((lead.outreachMessages[0].variant === 1 ? 2 : 1) as 1 | 2) : 1;
    const baseMsg = hasOutreach ? lead.outreachMessages[variant - 1] || lead.outreachMessages[0] : null;

    return {
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      subject: baseMsg?.subject || `AI Outreach for ${lead.name}`,
      body: baseMsg?.body || `Hi ${lead.name},\n\nWe would love to help you build an online presence for your business.\n\nBest,\nAcme Software Agency`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      variant,
    } as OutreachMessage;
  }

  // Real API call — always throw on failure so the UI surfaces the error.
  const result = await fetchWithAuth(`/leads/${leadId}/outreach`, {
    method: 'POST',
  }) as {
    success: boolean;
    error?: string;
    outreachSubject?: string;
    outreachBody?: string;
    followUp?: string;
    whatsappBody?: string;
    model?: string;
    message?: { id?: string; created_at?: string } | null;
  };

  // Backend returns { success: false, error: '...' } for structured failures.
  // fetchWithAuth already throws on non-2xx HTTP status, but this guards the case
  // where the backend returns 200 with success:false (defensive check).
  if (!result.success) {
    throw new Error(result.error || 'Outreach generation failed — check server logs');
  }

  const subject = result.outreachSubject ?? '';
  const body = result.outreachBody ?? '';

  if (!subject && !body) {
    throw new Error('Outreach generation returned empty subject and body from server');
  }

  return {
    id: result.message?.id ?? `ai-${Date.now()}`,
    subject,
    body,
    status: 'draft',
    createdAt: result.message?.created_at ?? new Date().toISOString(),
  } as OutreachMessage;
}

// ============================================================
// Send Outreach
// ============================================================
export async function sendOutreach(
  leadId: string,
  message: OutreachMessage,
  recipientEmail?: string
): Promise<void> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    await delay(jitter(800, 200));
    return;
  }

  try {
    await fetchWithAuth(`/leads/${leadId}/send-outreach`, {
      method: 'POST',
      body: JSON.stringify({
        subject: message.subject,
        body: message.body,
        recipient_email: recipientEmail,
      }),
    });
  } catch (err) {
    console.warn('sendOutreach failed:', err);
    if (isProd && !forceDemo) throw err;
  }
}

// ============================================================
// Save Draft
// ============================================================
export async function saveDraft(
  leadId: string,
  message: Partial<OutreachMessage>
): Promise<void> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    await delay(jitter(300, 50));
    return;
  }

  try {
    await fetchWithAuth(`/leads/${leadId}/save-draft`, {
      method: 'POST',
      body: JSON.stringify({
        subject: message.subject,
        body: message.body,
      }),
    });
  } catch (err) {
    console.warn('saveDraft failed:', err);
    // Non-fatal: draft may already be stored locally
  }
}

// ============================================================
// Prepare Lead / Opportunity (Audit + Analysis + Competitors + Outreach + Proposal)
// ============================================================
export interface PrepareLeadResult {
  lead: Lead;
  proposalContent?: string;
  proposalTitle?: string;
  audit?: DigitalAudit;
  opportunityAnalysis?: OpportunityAnalysis;
  competitorAnalysis?: CompetitorAnalysisResult;
  partialError?: string | null;
}

export async function prepareLead(
  leadId: string,
  force = false
): Promise<PrepareLeadResult> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    await delay(jitter(2000, 300));
    const lead = mockLeads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const hasWeb = lead.websiteStatus === 'has_website';
    const audit: DigitalAudit = {
      leadId,
      workspaceId: 'demo-workspace',
      websiteExists: hasWeb ? 'detected' : 'not_detected',
      httpsEnabled: hasWeb ? 'detected' : 'not_detected',
      mobileIndicator: hasWeb ? 'detected' : 'unknown',
      bookingDetected: 'not_detected',
      orderingDetected: 'not_detected',
      contactFormDetected: hasWeb ? 'detected' : 'not_detected',
      socialPresenceDetected: 'detected',
      digitalMaturityLevel: hasWeb ? 2 : 1,
      auditScore: hasWeb ? 68 : 28,
      auditData: {
        websiteScore: hasWeb ? 75 : 10,
        discoverabilityScore: 65,
        engagementScore: 70,
        conversionScore: 30,
        informationScore: 85,
        detectedServices: hasWeb ? ['Informational Website', 'Contact Form'] : ['Public Phone Directory'],
      },
      evidence: [
        {
          id: `ev-${leadId}-1`,
          type: 'website_presence',
          description: hasWeb ? `Active website verified: ${lead.websiteUrl}` : 'No public website detected in commercial directory',
          source: 'osm',
          confidence: 90,
          timestamp: new Date().toISOString(),
          isAiInference: false,
        },
        {
          id: `ev-${leadId}-2`,
          type: 'booking_mechanism',
          description: 'No online booking or self-service appointment mechanism detected',
          source: 'website_crawl',
          confidence: 85,
          timestamp: new Date().toISOString(),
          isAiInference: false,
        },
        {
          id: `ev-${leadId}-3`,
          type: 'public_reputation',
          description: `${lead.reviewCount ?? 45} customer reviews recorded with ${lead.rating ?? 4.2}/5.0 average`,
          source: 'osm',
          confidence: 90,
          timestamp: new Date().toISOString(),
          isAiInference: false,
        }
      ]
    };

    const opportunityAnalysis: OpportunityAnalysis = {
      leadId,
      workspaceId: 'demo-workspace',
      opportunityScore: lead.score || 85,
      confidenceScore: 84,
      dimensions: {
        digitalGap: hasWeb ? 6 : 9,
        categoryFit: 9,
        reviewActivity: 8,
        marketDensity: 8,
        competitorPresence: 8,
        commercialPotential: 8,
        businessNeed: 9,
        evidenceQuality: 8,
      },
      currentMaturityLevel: hasWeb ? 2 : 1,
      targetMaturityLevel: 3,
      maturityGap: hasWeb ? 1 : 2,
      primaryOpportunity: hasWeb ? 'Online Booking & Conversion System' : 'Digital Presence & Custom Website',
      secondaryOpportunities: ['Mobile Experience Refinement', 'Local SEO & Discoverability'],
      recommendedServices: [
        {
          service: hasWeb ? 'Online Appointment Flow' : 'Custom Responsive Website',
          category: 'Web Development',
          detectedProblem: hasWeb ? 'No online booking mechanism detected' : 'No public website detected',
          reason: 'High customer inquiry volume requires self-service digital scheduling.',
          expectedBenefit: 'Streamlines customer intake and captures after-hours appointments.',
          estimatedComplexity: 'Medium',
        },
        {
          service: 'Local Search Optimization',
          category: 'Local SEO',
          detectedProblem: 'Limited search visibility compared to nearby peers',
          reason: 'Local competitors hold stronger keyword positioning in the target area.',
          expectedBenefit: 'Increases discovery among searchers in immediate neighborhood.',
          estimatedComplexity: 'Low',
        }
      ],
      estimatedScope: {
        projectType: hasWeb ? 'Booking System Integration' : 'Full Web Development & Local Presence',
        complexity: 'Medium',
        duration: '3-4 weeks',
        suggestedTeam: ['Frontend Developer', 'UI/UX Designer'],
        preliminaryInvestmentRange: 'PKR 150,000 - 275,000 (Preliminary Estimate)',
      },
      reasoning: [
        `Customer demand is established with ${lead.reviewCount ?? 45} verified reviews.`,
        `Current digital maturity is Level ${hasWeb ? 2 : 1}, lagging behind the category benchmark of Level 3.`,
        `Nearby competitors offer digital booking functionality not present here.`
      ],
      evidence: audit.evidence,
      recommendedNextAction: {
        action: 'Dispatch personalized digital audit outreach',
        channel: 'email',
        objective: 'Initiate conversation with owner highlighting the booking capability gap',
        rationale: 'High opportunity score paired with verifiable public contact data.',
      }
    };

    const competitorAnalysis: CompetitorAnalysisResult = {
      leadId,
      workspaceId: 'demo-workspace',
      competitors: [
        {
          id: `peer-${leadId}-1`,
          name: `${lead.name.split(' ')[0]} Premier Services`,
          address: 'Main Commercial Avenue',
          rating: 4.6,
          reviewCount: 78,
          websiteExists: true,
          bookingExists: true,
          orderingExists: false,
          digitalMaturity: 3,
          distanceKm: 0.5,
        },
        {
          id: `peer-${leadId}-2`,
          name: `Elite ${lead.category} Center`,
          address: 'Adjacent Plaza',
          rating: 4.4,
          reviewCount: 52,
          websiteExists: true,
          bookingExists: true,
          orderingExists: false,
          digitalMaturity: 3,
          distanceKm: 0.9,
        }
      ],
      targetComparison: {
        targetMaturity: hasWeb ? 2 : 1,
        competitorAvgMaturity: 3.0,
        targetHasBooking: false,
        competitorsWithBookingPct: 100,
        targetHasWebsite: hasWeb,
        competitorsWithWebsitePct: 100,
      },
      competitiveGaps: [
        `100% of nearby peer competitors operate online booking flows, while none was detected for ${lead.name}.`,
        `Competitors maintain active Level 3 transactional presence, creating a convenience gap.`
      ],
      summary: `Benchmark analysis against 2 local peers indicates a distinct operational capability gap in online customer booking.`,
    };

    const demoResult: Lead = {
      ...lead,
      contactEmail: lead.contactEmail || ('owner@' + lead.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'),
      contactSource: 'website_homepage',
      contactConfidence: 0.85,
      outreachSubject: `Operational opportunity for ${lead.name} — Online Booking`,
      outreachBody: `Hi ${lead.name} team,\n\nWhile evaluating digital services in your area, we noted your strong reputation (${lead.reviewCount ?? 45} customer reviews).\n\nWe also detected that while local competitors offer online booking, your business currently does not appear to provide an automated appointment flow. We specialize in building fast, modern booking systems for ${lead.category} businesses.\n\nWould you be open to reviewing a 10-minute digital audit summary?\n\nBest regards,\nClientPilot AI`,
      outreachStatus: 'draft',
      outreachGeneratedAt: new Date().toISOString(),
      proposalContent: `# Commercial Project Proposal — ${lead.name}\n\n## Executive Summary\nClient Pilot AI has prepared this modernization proposal following a digital presence audit of ${lead.name}.\n\n## Identified Digital Gaps\n- No automated online booking or self-service appointment mechanism detected\n- Digital maturity currently at Level ${hasWeb ? 2 : 1} (Category Benchmark: Level 3)\n\n## Proposed Solution\n1. Custom Responsive Booking Portal\n2. Real-time Calendar & SMS/WhatsApp Notification Integration\n3. Local Search Optimization\n\n## Deliverables & Milestones\n- Week 1: Wireframes & Booking Workflow Architecture\n- Week 2-3: Frontend Development & Calendar Sync\n- Week 4: Quality Assurance, Staff Walkthrough & Launch\n\n## Estimated Investment\nPKR 175,000 - 250,000 *(Preliminary Estimate)*`,
      proposalStatus: 'draft',
      proposalGeneratedAt: new Date().toISOString(),
      audit,
      opportunityAnalysis,
      competitorAnalysis,
    };

    return {
      lead: demoResult,
      proposalContent: demoResult.proposalContent,
      proposalTitle: `Digital Modernization Proposal — ${lead.name}`,
      audit,
      opportunityAnalysis,
      competitorAnalysis,
    };
  }

  const result = await fetchWithAuth(`/leads/${leadId}/prepare`, {
    method: 'POST',
    body: JSON.stringify({ force }),
  }) as {
    lead: DbLead;
    proposal?: { title?: string; content?: string } | null;
    audit?: DigitalAudit;
    opportunityAnalysis?: OpportunityAnalysis;
    competitorAnalysis?: CompetitorAnalysisResult;
    error?: string | null;
  };

  const mappedLead = mapDbLeadToLead(result.lead as unknown as DbLead);
  if (result.audit) mappedLead.audit = result.audit;
  if (result.opportunityAnalysis) mappedLead.opportunityAnalysis = result.opportunityAnalysis;
  if (result.competitorAnalysis) mappedLead.competitorAnalysis = result.competitorAnalysis;

  return {
    lead: mappedLead,
    proposalContent: result.proposal?.content ?? mappedLead.proposalContent,
    proposalTitle: result.proposal?.title,
    audit: result.audit,
    opportunityAnalysis: result.opportunityAnalysis,
    competitorAnalysis: result.competitorAnalysis,
    partialError: result.error,
  };
}


// ============================================================
// Update Lead Stage
// ============================================================
export async function updateLeadStage(leadId: string, stage: PipelineStage): Promise<void> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    // Ignore session errors
  }

  if (isDemoMode(session)) {
    await delay(jitter(200, 50));
    return;
  }

  try {
    await fetchWithAuth(`/leads/${leadId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
  } catch (err) {
    console.warn('updateLeadStage API failed:', err);
  }
}

// ============================================================
// Admin Dashboard APIs
// ============================================================
export async function getAdminUsers(): Promise<unknown[]> {
  return fetchWithAuth('/admin/users');
}

export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<unknown> {
  return fetchWithAuth(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

// ============================================================
// Proposals APIs
// ============================================================

type ProposalStatus = 'draft' | 'submitted' | 'reviewed' | 'replied' | 'accepted' | 'rejected';

export async function getProposals(): Promise<import('../types').Proposal[]> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(300, 100));
    const local = localStorage.getItem('clientpilot_proposals');
    const list = local ? JSON.parse(local) : [];
    // Populate leads details from mockLeads if available
    return list.map((p: import('../types').Proposal) => {
      const lead = mockLeads.find((l) => l.id === p.leadId);
      return {
        ...p,
        leads: lead ? {
          business_name: lead.name,
          category: lead.category,
          address: lead.address,
          city: lead.city,
        } : p.leads,
      };
    });
  }

  try {
    const raw = await fetchWithAuth('/proposals') as Record<string, unknown>[];
    return raw.map((p) => ({
      id: p['id'] as string,
      leadId: p['lead_id'] as string,
      workspaceId: p['workspace_id'] as string,
      title: p['title'] as string,
      content: p['content'] as string,
      status: p['status'] as ProposalStatus,
      createdAt: p['created_at'] as string,
      updatedAt: p['updated_at'] as string,
      leads: p['leads'] as import('../types').Proposal['leads'],
    }));
  } catch (err) {
    console.warn('getProposals failed:', err);
    if (isProd && !forceDemo) throw err;
    return [];
  }
}

export async function generateProposalApi(leadId: string): Promise<{ title: string; content: string }> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(2000, 500));
    const lead = mockLeads.find((l) => l.id === leadId);
    const bizName = lead ? lead.name : 'Your Business';
    const bizCategory = lead ? getCategoryLabel(lead.category) : 'Business Services';
    return {
      title: `Digital Transformation Proposal for ${bizName}`,
      content: `# Digital Transformation Proposal\n\n**Prepared For**: ${bizName}\n**Business Category**: ${bizCategory}\n\n## Executive Summary\nWe have identified a significant opportunity to help **${bizName}** establish a strong local digital presence. This proposal outlines our recommended approach to building your online visibility and driving more customer visits.\n\n## Digital Presence Review\nBased on our analysis, ${bizName} currently lacks a modern online presence which is limiting customer discovery. Implementing local search engine optimization (SEO) and professional branding will bridge this gap.\n\n## Tailored Solution\n- **Professional Mobile-First Website**: Responsive, optimized for local search engines.\n- **Direct WhatsApp Messaging**: Let nearby customers contact you instantly.\n- **Google Maps Optimization**: Build prominence in local map recommendations.\n\n## Project Plan\n- **Week 1-2**: Design, content draft, local SEO research\n- **Week 3**: Development & review cycle\n- **Week 4**: Go-live, launch, and initial local indexing\n\n## Next Steps\nIf this plan aligns with your growth goals, reply directly to this proposal to schedule a brief consultation call.`,
    };
  }

  try {
    const result = await fetchWithAuth('/proposals/generate', {
      method: 'POST',
      body: JSON.stringify({ leadId }),
    });
    return result as { title: string; content: string };
  } catch (err) {
    console.warn('generateProposalApi failed:', err);
    if (isProd && !forceDemo) throw err;
    throw new Error('Proposal generation failed', { cause: err });
  }
}

export async function saveProposalApi(params: {
  leadId: string;
  title: string;
  content: string;
  status?: ProposalStatus;
}): Promise<import('../types').Proposal> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(400, 100));
    const local = localStorage.getItem('clientpilot_proposals');
    const list = local ? JSON.parse(local) : [];
    
    // Check if proposal for this lead already exists to simulate unique constraints
    const existingIndex = list.findIndex((p: import('../types').Proposal) => p.leadId === params.leadId);
    
    const newProposal: import('../types').Proposal = {
      id: existingIndex >= 0 ? list[existingIndex].id : Math.random().toString(36).substring(2, 11),
      leadId: params.leadId,
      workspaceId: 'demo-workspace-id',
      title: params.title,
      content: params.content,
      status: params.status ?? 'draft',
      createdAt: existingIndex >= 0 ? list[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = newProposal;
    } else {
      list.push(newProposal);
    }
    
    localStorage.setItem('clientpilot_proposals', JSON.stringify(list));

    const lead = mockLeads.find((l) => l.id === params.leadId);
    return {
      ...newProposal,
      leads: lead ? {
        business_name: lead.name,
        category: lead.category,
        address: lead.address,
        city: lead.city,
      } : undefined,
    };
  }

  const raw = await fetchWithAuth('/proposals', {
    method: 'POST',
    body: JSON.stringify({
      leadId: params.leadId,
      title: params.title,
      content: params.content,
      status: params.status ?? 'draft',
    }),
  }) as Record<string, unknown>;

  return {
    id: raw['id'] as string,
    leadId: raw['lead_id'] as string,
    workspaceId: raw['workspace_id'] as string,
    title: raw['title'] as string,
    content: raw['content'] as string,
    status: raw['status'] as ProposalStatus,
    createdAt: raw['created_at'] as string,
    updatedAt: raw['updated_at'] as string,
    leads: raw['leads'] as import('../types').Proposal['leads'],
  };
}

export async function updateProposalStatusApi(id: string, status: ProposalStatus): Promise<void> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(200, 50));
    const local = localStorage.getItem('clientpilot_proposals');
    const list = local ? JSON.parse(local) : [];
    const updated = list.map((p: import('../types').Proposal) =>
      p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
    );
    localStorage.setItem('clientpilot_proposals', JSON.stringify(updated));
    return;
  }

  await fetchWithAuth(`/proposals/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteProposalApi(id: string): Promise<void> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(200, 50));
    const local = localStorage.getItem('clientpilot_proposals');
    const list = local ? JSON.parse(local) : [];
    const filtered = list.filter((p: import('../types').Proposal) => p.id !== id);
    localStorage.setItem('clientpilot_proposals', JSON.stringify(filtered));
    return;
  }

  await fetchWithAuth(`/proposals/${id}`, { method: 'DELETE' });
}

// ============================================================
// FYP Intelligence API Methods
// ============================================================

export async function getDigitalAudit(leadId: string): Promise<DigitalAudit | null> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    const lead = mockLeads.find((l) => l.id === leadId);
    if (!lead) return null;
    return (lead as any).audit || null;
  }

  try {
    return await fetchWithAuth(`/audits/${leadId}`);
  } catch {
    return null;
  }
}

export async function runDigitalAudit(leadId: string): Promise<DigitalAudit> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(1200, 200));
    const prep = await prepareLead(leadId);
    return prep.audit!;
  }

  return await fetchWithAuth(`/audits/${leadId}/run`, { method: 'POST' });
}

export async function getOpportunityAnalysis(leadId: string): Promise<OpportunityAnalysis | null> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    const lead = mockLeads.find((l) => l.id === leadId);
    if (!lead) return null;
    return (lead as any).opportunityAnalysis || null;
  }

  try {
    return await fetchWithAuth(`/opportunities/${leadId}`);
  } catch {
    return null;
  }
}

export async function analyzeOpportunity(leadId: string): Promise<OpportunityAnalysis> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(1500, 250));
    const prep = await prepareLead(leadId);
    return prep.opportunityAnalysis!;
  }

  return await fetchWithAuth(`/opportunities/${leadId}/analyze`, { method: 'POST' });
}

export async function getCompetitorAnalysis(leadId: string): Promise<CompetitorAnalysisResult | null> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    const lead = mockLeads.find((l) => l.id === leadId);
    if (!lead) return null;
    return (lead as any).competitorAnalysis || null;
  }

  try {
    return await fetchWithAuth(`/competitors/${leadId}`);
  } catch {
    // If not found, trigger analyze
    try {
      return await fetchWithAuth(`/competitors/${leadId}/analyze`, { method: 'POST' });
    } catch {
      return null;
    }
  }
}

export async function getOpportunityZones(): Promise<OpportunityZone[]> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    return [
      {
        zoneName: 'Karachi — Clifton Commercial',
        centerLat: 24.8138,
        centerLng: 67.0300,
        totalOpportunities: 34,
        avgOpportunityScore: 86,
        avgMaturityLevel: 1.8,
        topCategory: 'clinic',
        highPriorityCount: 22,
      },
      {
        zoneName: 'Karachi — DHA Phase 5 & 6',
        centerLat: 24.8250,
        centerLng: 67.0650,
        totalOpportunities: 28,
        avgOpportunityScore: 82,
        avgMaturityLevel: 2.1,
        topCategory: 'salon',
        highPriorityCount: 16,
      },
      {
        zoneName: 'Karachi — Gulshan-e-Iqbal Block 13/14',
        centerLat: 24.9180,
        centerLng: 67.0971,
        totalOpportunities: 25,
        avgOpportunityScore: 88,
        avgMaturityLevel: 1.2,
        topCategory: 'restaurant',
        highPriorityCount: 19,
      },
      {
        zoneName: 'Lahore — Gulberg Commercial',
        centerLat: 31.5204,
        centerLng: 74.3587,
        totalOpportunities: 29,
        avgOpportunityScore: 84,
        avgMaturityLevel: 1.9,
        topCategory: 'retail',
        highPriorityCount: 17,
      },
      {
        zoneName: 'Islamabad — Blue Area & F-7',
        centerLat: 33.7200,
        centerLng: 73.0600,
        totalOpportunities: 21,
        avgOpportunityScore: 81,
        avgMaturityLevel: 2.3,
        topCategory: 'real_estate',
        highPriorityCount: 12,
      }
    ];
  }

  try {
    const zones = await fetchWithAuth('/opportunities/zones');
    return zones || [];
  } catch {
    return [];
  }
}

export async function getMarketIntelligence(): Promise<MarketIntelligenceStats> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    return {
      totalOpportunities: mockLeads.length,
      avgOpportunityScore: 83,
      avgConfidenceScore: 82,
      digitalMaturityDistribution: [
        { level: 0, label: 'Level 0 — Digitally Invisible', count: 8 },
        { level: 1, label: 'Level 1 — Basic Presence', count: 22 },
        { level: 2, label: 'Level 2 — Informational Presence', count: 14 },
        { level: 3, label: 'Level 3 — Transactional Presence', count: 5 },
        { level: 4, label: 'Level 4 — Digitally Optimized', count: 1 },
      ],
      topCategoryOpportunities: [
        { category: 'restaurant', count: 14, avgScore: 87 },
        { category: 'clinic', count: 11, avgScore: 89 },
        { category: 'salon', count: 8, avgScore: 84 },
        { category: 'retail', count: 7, avgScore: 79 },
        { category: 'bakery', count: 5, avgScore: 82 },
        { category: 'auto_service', count: 5, avgScore: 78 },
      ],
      digitalGapDistribution: [
        { gap: 'No Public Website', percentage: 46, count: 23 },
        { gap: 'Missing Online Booking', percentage: 68, count: 34 },
        { gap: 'Missing Online Ordering', percentage: 38, count: 19 },
        { gap: 'Weak Mobile Optimization', percentage: 28, count: 14 },
      ],
      opportunityZones: await getOpportunityZones(),
    };
  }

  try {
    const stats = await fetchWithAuth('/intelligence/market');
    const zones = await getOpportunityZones();
    return { ...stats, opportunityZones: zones };
  } catch {
    return {
      totalOpportunities: 0,
      avgOpportunityScore: 0,
      avgConfidenceScore: 0,
      digitalMaturityDistribution: [],
      topCategoryOpportunities: [],
      digitalGapDistribution: [],
      opportunityZones: [],
    };
  }
}

export async function getModelEvaluation(): Promise<ModelEvaluationStats> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    return {
      totalAnalyzed: mockLeads.length,
      totalWithOutcomes: 28,
      scoreBands: [
        {
          band: '80-100 (High)',
          leadCount: 26,
          replies: 12,
          proposalsSent: 9,
          wonDeals: 5,
          replyRatePct: 46.2,
          conversionRatePct: 19.2,
        },
        {
          band: '60-79 (Medium)',
          leadCount: 18,
          replies: 4,
          proposalsSent: 3,
          wonDeals: 1,
          replyRatePct: 22.2,
          conversionRatePct: 5.6,
        },
        {
          band: '0-59 (Low)',
          leadCount: 6,
          replies: 0,
          proposalsSent: 0,
          wonDeals: 0,
          replyRatePct: 0.0,
          conversionRatePct: 0.0,
        },
      ],
      evidenceQualityStats: {
        avgConfidencePct: 84,
        verifiedContactsPct: 88,
        directCrawlCoveragePct: 76,
      },
      researchMetrics: {
        correlationDescription: 'Empirical correlation observed across demonstration outcomes: businesses scoring 80-100 demonstrated 2.1x higher reply rates and 3.4x higher deal conversion rates compared to the 60-79 band.',
        hasSufficientData: true,
        sampleSize: 28,
      }
    };
  }

  try {
    return await fetchWithAuth('/intelligence/evaluation');
  } catch {
    return {
      totalAnalyzed: 0,
      totalWithOutcomes: 0,
      scoreBands: [],
      evidenceQualityStats: {
        avgConfidencePct: 0,
        verifiedContactsPct: 0,
        directCrawlCoveragePct: 0,
      },
      researchMetrics: {
        correlationDescription: 'Evaluation pending — insufficient labeled outcome events recorded.',
        hasSufficientData: false,
        sampleSize: 0,
      },
    };
  }
}

export async function getOutcomeEvents(leadId: string): Promise<OutcomeEvent[]> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    return [
      {
        id: `ev-out-${leadId}-1`,
        leadId,
        workspaceId: 'demo-workspace',
        eventType: 'discovered',
        eventDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        source: 'system_pipeline',
        notes: 'Business discovered via OpenStreetMap geospatial radar scan.',
      },
      {
        id: `ev-out-${leadId}-2`,
        leadId,
        workspaceId: 'demo-workspace',
        eventType: 'audited',
        eventDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        source: 'system_pipeline',
        notes: 'Automated digital audit completed; digital maturity evaluated at Level 1.',
      },
      {
        id: `ev-out-${leadId}-3`,
        leadId,
        workspaceId: 'demo-workspace',
        eventType: 'qualified',
        eventDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        source: 'user_action',
        notes: 'Opportunity validated; high potential booking capability gap confirmed.',
      },
    ];
  }

  try {
    return await fetchWithAuth(`/outcomes/${leadId}`);
  } catch {
    return [];
  }
}

export async function logOutcomeEvent(
  leadId: string,
  eventType: OutcomeEventType,
  notes?: string
): Promise<OutcomeEvent> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    await delay(jitter(200, 50));
    return {
      id: `ev-out-${Date.now()}`,
      leadId,
      workspaceId: 'demo-workspace',
      eventType,
      eventDate: new Date().toISOString(),
      source: 'user_action',
      notes,
    };
  }

  return await fetchWithAuth(`/outcomes/${leadId}`, {
    method: 'POST',
    body: JSON.stringify({ eventType, notes }),
  });
}

export async function getOutcomeTimeline(): Promise<OutcomeEvent[]> {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch { /* ignore */ }

  if (isDemoMode(session)) {
    return [
      {
        id: 'ev-1',
        leadId: 'lead-001',
        workspaceId: 'demo-workspace',
        eventType: 'won',
        eventDate: new Date(Date.now() - 1 * 3600000).toISOString(),
        source: 'user_action',
        notes: 'Client accepted proposal for WhatsApp ordering flow.',
      },
      {
        id: 'ev-2',
        leadId: 'lead-002',
        workspaceId: 'demo-workspace',
        eventType: 'proposal_sent',
        eventDate: new Date(Date.now() - 4 * 3600000).toISOString(),
        source: 'user_action',
        notes: 'Custom booking portal proposal delivered via email.',
      },
      {
        id: 'ev-3',
        leadId: 'lead-003',
        workspaceId: 'demo-workspace',
        eventType: 'contacted',
        eventDate: new Date(Date.now() - 8 * 3600000).toISOString(),
        source: 'email_outreach',
        notes: 'Initial audit summary email dispatched.',
      }
    ];
  }

  try {
    return await fetchWithAuth('/outcomes/timeline');
  } catch {
    return [];
  }
}


