/**
 * src/api/opportunities.ts
 * Opportunity intelligence API
 */

import { apiPost, apiGet } from './client';
import type { OpportunityAnalysis, OpportunityZone } from '@/types';

export async function analyzeOpportunity(leadId: string): Promise<OpportunityAnalysis> {
  return apiPost<OpportunityAnalysis>(`/opportunities/${leadId}/analyze`, {});
}

export async function getOpportunity(leadId: string): Promise<OpportunityAnalysis | null> {
  try {
    return await apiGet<OpportunityAnalysis>(`/opportunities/${leadId}`);
  } catch {
    return null;
  }
}

export async function getOpportunityZones(): Promise<OpportunityZone[]> {
  try {
    const result = await apiGet<{ zones: OpportunityZone[] }>('/opportunities/zones');
    return result.zones || [];
  } catch {
    return [];
  }
}
