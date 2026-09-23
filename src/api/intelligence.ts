/**
 * src/api/intelligence.ts
 * Market intelligence & academic evaluation — real DB aggregates
 */

import { apiGet } from './client';
import type { MarketIntelligenceStats, ModelEvaluationStats } from '@/types';

export async function getMarketIntelligence(): Promise<MarketIntelligenceStats | null> {
  try {
    return await apiGet<MarketIntelligenceStats>('/intelligence/market');
  } catch {
    return null;
  }
}

export async function getEvaluationStats(): Promise<ModelEvaluationStats | null> {
  try {
    return await apiGet<ModelEvaluationStats>('/intelligence/evaluation');
  } catch {
    return null;
  }
}
