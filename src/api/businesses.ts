/**
 * src/api/businesses.ts
 * Real business discovery via backend → Overpass/OSM
 */

import { apiPost, apiGet } from './client';
import type { Lead, ProgressStep } from '@/types';

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
  pipeline_stage?: string;
  created_at?: string;
  distance?: number;
  lat?: number;
  lng?: number;
  contact_email?: string | null;
  contact_phone?: string | null;
  lead_scores?: { overall_score?: number; ai_reasoning?: string }[];
  business_audits?: { digital_maturity_level?: number; audit_score?: number }[];
  opportunity_analysis?: { opportunity_score?: number; confidence_score?: number }[];
}

function mapDbLeadToLead(db: DbLead): Lead {
  const scores = Array.isArray(db.lead_scores) ? db.lead_scores[0] : db.lead_scores;
  const audit = Array.isArray(db.business_audits) ? db.business_audits[0] : db.business_audits;
  const opp = Array.isArray(db.opportunity_analysis) ? db.opportunity_analysis[0] : db.opportunity_analysis;

  return {
    id: db.id,
    businessName: db.business_name || 'Unknown Business',
    category: (db.category || 'business') as Lead['category'],
    address: db.address || '',
    city: (db.city || 'Karachi') as Lead['city'],
    phone: db.phone ?? undefined,
    rating: db.rating ?? undefined,
    reviewCount: db.review_count ?? undefined,
    hasWebsite: db.has_website ?? !!db.website_url,
    websiteUrl: db.website_url ?? undefined,
    score: opp?.opportunity_score ?? scores?.overall_score ?? 0,
    pipelineStage: (db.pipeline_stage || 'discovery') as Lead['pipelineStage'],
    discoveredAt: db.created_at || new Date().toISOString(),
    distance: db.distance ?? undefined,
    aiAnalysis: scores?.ai_reasoning || '',
    outreachMessages: [],
    latitude: db.lat ?? undefined,
    longitude: db.lng ?? undefined,
    contactEmail: db.contact_email ?? undefined,
    opportunityScore: opp?.opportunity_score ?? undefined,
    confidenceScore: opp?.confidence_score ?? undefined,
  } as any;
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
