/**
 * src/api/businesses.ts
 * Real business discovery via backend → Overpass/OSM
 */

import { apiPost, apiGet } from './client';
import type { DetectionStatus, DigitalAudit, Lead, ProgressStep } from '@/types';

export interface DiscoverParams {
  location?: string;
  lat?: number;
  lng?: number;
  categories: string[];
  radiusKm: number;
}

export interface DiscoverResult {
  leads: Lead[];
  geocodedLocation?: {
    lat: number;
    lng: number;
    displayName: string;
  };
  totalFound?: number;
}

/**
 * A `leads` row as the API returns it, including the related rows the backend
 * embeds via PostgREST. Snake_case throughout: these are database column names.
 */
export interface DbLead {
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
  website?: string | null;
  pipeline_stage?: string;
  created_at?: string;
  distance?: number;
  lat?: number;
  lng?: number;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_source?: string | null;
  contact_confidence?: number | null;
  outreach_subject?: string | null;
  outreach_body?: string | null;
  outreach_status?: string | null;
  outreach_generated_at?: string | null;
  outreach_sent_at?: string | null;
  proposal_content?: string | null;
  proposal_status?: string | null;
  proposal_generated_at?: string | null;
  last_enrichment_run_at?: string | null;
  last_error?: string | null;
  lead_scores?: DbLeadScore[] | DbLeadScore | null;
  outreach_messages?: DbOutreachMessage[] | DbOutreachMessage | null;
  business_audits?: DbBusinessAudit[] | DbBusinessAudit | null;
  opportunity_analysis?: DbOpportunityAnalysis[] | DbOpportunityAnalysis | null;
}

interface DbLeadScore {
  overall_score?: number | null;
  digital_presence_gap?: number | null;
  category_fit?: number | null;
  review_activity?: number | null;
  market_density?: number | null;
  competitor_presence?: number | null;
  ai_reasoning?: string | null;
}

interface DbOutreachMessage {
  id?: string;
  subject?: string | null;
  content?: string | null;
  status?: string | null;
  variant?: number | null;
  created_at?: string | null;
}

interface DbBusinessAudit {
  id?: string;
  lead_id?: string;
  workspace_id?: string;
  website_exists?: string | null;
  https_enabled?: string | null;
  mobile_indicator?: string | null;
  booking_detected?: string | null;
  ordering_detected?: string | null;
  contact_form_detected?: string | null;
  social_presence_detected?: string | null;
  digital_maturity_level?: number | null;
  audit_score?: number | null;
  audit_data?: DigitalAudit['auditData'] | null;
  evidence?: DigitalAudit['evidence'] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Empty sub-scores for an audit row stored before `audit_data` was populated. */
const EMPTY_AUDIT_DATA: DigitalAudit['auditData'] = {
  websiteScore: 0,
  discoverabilityScore: 0,
  engagementScore: 0,
  conversionScore: 0,
  informationScore: 0,
  detectedServices: [],
  websiteAudit: null,
  websiteHealthScore: null,
  websiteGrade: null,
};

/**
 * Maps a stored `business_audits` row onto the `DigitalAudit` the drawer renders.
 *
 * The lead list has always embedded `business_audits`, but nothing converted the
 * row, so `lead.audit` was permanently undefined and the Audit tab reported "no
 * audit data yet" even for leads that had been audited.
 */
function mapAudit(db: DbBusinessAudit | undefined, leadId: string): DigitalAudit | undefined {
  if (!db) return undefined;

  const detection = (value: string | null | undefined): DetectionStatus =>
    value === 'detected' || value === 'not_detected' ? value : 'unknown';

  return {
    id: db.id,
    leadId: db.lead_id || leadId,
    workspaceId: db.workspace_id || '',
    websiteExists: detection(db.website_exists),
    httpsEnabled: detection(db.https_enabled),
    mobileIndicator: detection(db.mobile_indicator),
    bookingDetected: detection(db.booking_detected),
    orderingDetected: detection(db.ordering_detected),
    contactFormDetected: detection(db.contact_form_detected),
    socialPresenceDetected: detection(db.social_presence_detected),
    digitalMaturityLevel: (Math.min(4, Math.max(0, db.digital_maturity_level ?? 0)) as DigitalAudit['digitalMaturityLevel']),
    auditScore: db.audit_score ?? 0,
    auditData: db.audit_data ?? EMPTY_AUDIT_DATA,
    evidence: db.evidence ?? [],
    createdAt: db.created_at ?? undefined,
    updatedAt: db.updated_at ?? undefined,
  };
}

interface DbOpportunityAnalysis {
  opportunity_score?: number | null;
  confidence_score?: number | null;
}

/** PostgREST returns an embedded relation as an array, or an object when limited to one. */
function firstOf<T>(value: T[] | T | null | undefined): T | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

/**
 * Derives the three-state website status the UI renders from the columns the
 * database actually stores. `outdated` is reported only when an audit observed a
 * live site that fails its checks — a URL alone cannot distinguish "modern" from
 * "neglected", so a site with no audit is reported simply as present.
 */
function deriveWebsiteStatus(db: DbLead, audit?: DbBusinessAudit): Lead['websiteStatus'] {
  const url = db.website_url || db.website;
  if (!url && !db.has_website) return 'none';
  if (audit && typeof audit.digital_maturity_level === 'number' && audit.digital_maturity_level <= 1) {
    return 'outdated';
  }
  return 'has_website';
}

/**
 * Converts an API lead row into the camelCase `Lead` the UI consumes.
 *
 * This is the single conversion point between database and UI shapes. An
 * earlier version emitted `businessName` and was cast with `as any`, which hid
 * the fact that it satisfied no consumer: the `Lead` type declares `name`, and
 * all 32 call sites read `.name`, so every real lead rendered as blank. The cast
 * is gone deliberately — the compiler should reject a shape the UI cannot use.
 */
export function mapDbLeadToLead(db: DbLead): Lead {
  const scores = firstOf(db.lead_scores);
  const audit = firstOf(db.business_audits);
  const opportunity = firstOf(db.opportunity_analysis);

  const messages = Array.isArray(db.outreach_messages)
    ? db.outreach_messages
    : db.outreach_messages
      ? [db.outreach_messages]
      : [];

  const outreachMessages: Lead['outreachMessages'] = messages
    .filter((message) => message.subject || message.content)
    .map((message) => ({
      id: message.id,
      subject: message.subject || '',
      body: message.content || '',
      createdAt: message.created_at || undefined,
      generatedAt: message.created_at || undefined,
      status: message.status === 'sent' ? 'sent' : 'draft',
      variant: message.variant ?? 1,
    }));

  // The lead row itself carries the current draft, which may be newer than any
  // persisted outreach_messages row. Surface it so the drawer shows the draft.
  if (outreachMessages.length === 0 && (db.outreach_subject || db.outreach_body)) {
    outreachMessages.push({
      subject: db.outreach_subject || '',
      body: db.outreach_body || '',
      generatedAt: db.outreach_generated_at || undefined,
      status: db.outreach_status === 'sent' ? 'sent' : 'draft',
      variant: 1,
    });
  }

  return {
    id: db.id,
    name: db.business_name || 'Unnamed business',
    category: (db.category || 'retail') as Lead['category'],
    address: db.address || '',
    // `city` is a free-text column; the narrow union in the Lead type does not
    // constrain what discovery can return, so pass it through unchanged.
    city: (db.city || '') as Lead['city'],
    phone: db.phone ?? db.contact_phone ?? undefined,
    rating: db.rating ?? undefined,
    reviewCount: db.review_count ?? undefined,
    websiteStatus: deriveWebsiteStatus(db, audit),
    websiteUrl: db.website_url ?? db.website ?? undefined,
    score: opportunity?.opportunity_score ?? scores?.overall_score ?? 0,
    scoreBreakdown: {
      digitalPresenceGap: scores?.digital_presence_gap ?? 0,
      categoryFit: scores?.category_fit ?? 0,
      reviewActivity: scores?.review_activity ?? 0,
      marketDensity: scores?.market_density ?? 0,
      competitorPresence: scores?.competitor_presence ?? 0,
    },
    pipelineStage: (db.pipeline_stage || 'discovery') as Lead['pipelineStage'],
    discoveredAt: db.created_at || new Date().toISOString(),
    distance: db.distance ?? undefined,
    aiAnalysis: scores?.ai_reasoning || '',
    outreachMessages,
    latitude: db.lat ?? undefined,
    longitude: db.lng ?? undefined,
    contactEmail: db.contact_email ?? undefined,
    contactPhone: db.contact_phone ?? undefined,
    website: db.website ?? undefined,
    contactSource: (db.contact_source as Lead['contactSource']) ?? undefined,
    contactConfidence: db.contact_confidence ?? undefined,
    outreachSubject: db.outreach_subject ?? undefined,
    outreachBody: db.outreach_body ?? undefined,
    outreachStatus: (db.outreach_status as Lead['outreachStatus']) ?? undefined,
    outreachGeneratedAt: db.outreach_generated_at ?? undefined,
    outreachSentAt: db.outreach_sent_at ?? undefined,
    proposalContent: db.proposal_content ?? undefined,
    proposalStatus: (db.proposal_status as Lead['proposalStatus']) ?? undefined,
    proposalGeneratedAt: db.proposal_generated_at ?? undefined,
    lastEnrichmentRunAt: db.last_enrichment_run_at ?? undefined,
    lastError: db.last_error ?? null,
    audit: mapAudit(audit, db.id),
  };
}

/**
 * Discover real businesses via OSM/Overpass.
 * Returns actual API results — NEVER mock data.
 * Throws ApiError if the request fails.
 */
export async function discoverBusinesses(
  params: DiscoverParams,
  onProgress?: (steps: ProgressStep[]) => void
): Promise<DiscoverResult> {
  if (onProgress) {
    onProgress([
      { id: '1', label: 'Geocoding location...', status: 'active' },
      { id: '2', label: 'Querying OpenStreetMap / Overpass...', status: 'pending' },
      { id: '3', label: 'Storing & scoring results...', status: 'pending' },
    ]);
  }

  const result = await apiPost<{ leads: DbLead[]; geocodedLocation?: unknown; totalFound?: number }>(
    '/leads/discover',
    {
      location: params.location,
      lat: params.lat,
      lng: params.lng,
      categories: params.categories,
      radiusMeters: params.radiusKm * 1000,
    }
  );

  if (onProgress) {
    onProgress([
      { id: '1', label: 'Geocoding location...', status: 'done' },
      { id: '2', label: 'Querying OpenStreetMap / Overpass...', status: 'done' },
      { id: '3', label: 'Storing & scoring results...', status: 'done' },
    ]);
  }

  return {
    leads: (result.leads || []).map(mapDbLeadToLead),
    geocodedLocation: result.geocodedLocation as DiscoverResult['geocodedLocation'],
    totalFound: result.totalFound,
  };
}

/**
 * Fetch all leads for the authenticated workspace from the database.
 */
export async function fetchLeads(): Promise<Lead[]> {
  const data = await apiGet<DbLead[]>('/leads');
  return (data || []).map(mapDbLeadToLead);
}

/**
 * Fetch a single lead by ID.
 */
export async function fetchLead(id: string): Promise<Lead | null> {
  try {
    const data = await apiGet<DbLead>(`/leads/${id}`);
    return mapDbLeadToLead(data);
  } catch {
    return null;
  }
}
