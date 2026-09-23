/**
 * src/api/audits.ts
 * Digital audit API — triggers real website crawl via backend
 */

import { apiPost, apiGet } from './client';
import type { DigitalAudit } from '@/types';

export async function runAudit(leadId: string): Promise<DigitalAudit> {
  return apiPost<DigitalAudit>(`/audits/${leadId}/run`, {});
}

export async function getAudit(leadId: string): Promise<DigitalAudit | null> {
  try {
    return await apiGet<DigitalAudit>(`/audits/${leadId}`);
  } catch {
    return null;
  }
}
