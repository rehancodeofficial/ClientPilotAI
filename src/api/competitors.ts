/**
 * src/api/competitors.ts
 * Competitor intelligence — real nearby business benchmarking
 */

import { apiPost, apiGet } from './client';
import type { CompetitorAnalysisResult } from '@/types';

export async function analyzeCompetitors(leadId: string): Promise<CompetitorAnalysisResult> {
  return apiPost<CompetitorAnalysisResult>(`/competitors/${leadId}/analyze`, {});
}

export async function getCompetitors(leadId: string): Promise<CompetitorAnalysisResult | null> {
  try {
    return await apiGet<CompetitorAnalysisResult>(`/competitors/${leadId}`);
  } catch {
    return null;
  }
}
