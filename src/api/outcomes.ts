/**
 * src/api/outcomes.ts
 * Outcome tracking — real pipeline event storage
 */

import { apiGet, apiPost } from './client';
import type { OutcomeEvent, OutcomeEventType } from '@/types';

export async function getOutcomes(leadId: string): Promise<OutcomeEvent[]> {
  try {
    const result = await apiGet<{ events: OutcomeEvent[] }>(`/outcomes/${leadId}`);
    return result.events || [];
  } catch {
    return [];
  }
}

export async function recordOutcome(
  leadId: string,
  eventType: OutcomeEventType,
  notes?: string
): Promise<OutcomeEvent> {
  return apiPost<OutcomeEvent>(`/outcomes/${leadId}`, { event_type: eventType, notes });
}

export async function getRecentActivity(limit = 10): Promise<OutcomeEvent[]> {
  try {
    const result = await apiGet<{ events: OutcomeEvent[] }>(`/outcomes/recent?limit=${limit}`);
    return result.events || [];
  } catch {
    return [];
  }
}
