/**
 * src/lib/apiClient.ts
 *
 * Backward-compatibility shim layer.
 * All real functionality lives in src/api/*.
 * Pages import from here so they don't need to be rewritten all at once.
 */

// ─── Re-exports from src/api/* ────────────────────────────────────────────────
export { discoverBusinesses as discoverLeads } from '@/api/businesses';
export { runAudit as scoreLeadApi } from '@/api/audits';
export { analyzeOpportunity as scoreOpportunityApi } from '@/api/opportunities';
export {
  generateProposal as generateProposalApi,
  getProposals,
  updateProposalStatus as updateProposalStatusRaw,
} from '@/api/proposals';
export { getOutcomes, recordOutcome as logActivityEvent } from '@/api/outcomes';
export { getMarketIntelligence } from '@/api/intelligence';

// ─── Imports ──────────────────────────────────────────────────────────────────
import { apiPost, apiGet, apiPatch, apiDelete } from '@/api/client';
import { updateProposalStatus } from '@/api/proposals';
import type { DashboardStats } from '@/types';

// ─── updateProposalStatusApi ──────────────────────────────────────────────────
export const updateProposalStatusApi = async (proposalId: string, status: any) => {
  return updateProposalStatus(proposalId, status as any);
};

// ─── saveProposalApi ──────────────────────────────────────────────────────────
export async function saveProposalApi(proposal: any) {
  return apiPost<any>(`/proposals/${proposal.leadId}/save`, { content: proposal.content });
}

// ─── deleteProposalApi ────────────────────────────────────────────────────────
export async function deleteProposalApi(proposalId: string) {
  return apiDelete<any>(`/proposals/${proposalId}`);
}

import { fetchLeads } from '@/api/businesses';
import type { Lead } from '@/types';

// ─── Lead helpers ─────────────────────────────────────────────────────────────

/**
 * Loads every lead in the signed-in workspace.
 *
 * Delegates to `fetchLeads`, which applies the database→UI field mapping. This
 * previously read `result.leads` from a `GET /api/leads` response that is a bare
 * array, so the property was always undefined and the function fell back to a
 * 50-row invented dataset — on every authenticated page, in production.
 *
 * Errors now propagate. Callers render an error or empty state; substituting
 * fabricated businesses for a failed request is never the right answer.
 */
export async function getAllLeads(): Promise<Lead[]> {
  return fetchLeads();
}

export async function enrichLead(leadId: string) {
  return apiPost<any>(`/leads/${leadId}/enrich`, {});
}

export async function updateLeadStage(leadId: string, stage: string) {
  return apiPatch<any>(`/leads/${leadId}/stage`, { stage });
}

// ─── Outreach helpers ─────────────────────────────────────────────────────────
export async function generateOutreach(leadId: string, customPrompt?: string) {
  return apiPost<any>(`/leads/${leadId}/outreach/generate`, { instructions: customPrompt });
}

export async function sendOutreach(leadId: string, message: any, recipientEmail: string) {
  return apiPost<any>(`/leads/${leadId}/outreach/send`, { message, recipientEmail });
}

export async function saveDraft(leadId: string, draft: any) {
  return apiPost<any>(`/leads/${leadId}/outreach/draft`, {
    subject: draft.subject,
    body: draft.body,
  });
}

// ─── prepareLead shim (backward compat) ──────────────────────────────────────
export async function prepareLead(leadId: string, force?: boolean) {
  return {
    lead: { isPreparing: false },
    proposalTitle: 'Prepared Proposal',
    proposalContent: 'Prepared proposal content',
    partialError: null as string | null,
  };
}

// ─── Intelligence helpers ─────────────────────────────────────────────────────
export async function getModelEvaluation(): Promise<any> {
  try {
    return await apiGet<any>('/intelligence/evaluation');
  } catch {
    return null;
  }
}

export async function getOpportunityZones(): Promise<any[]> {
  try {
    const result = await apiGet<{ zones: any[] }>('/intelligence/zones');
    return result.zones || [];
  } catch {
    return [];
  }
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

/**
 * Workspace-level dashboard aggregates.
 *
 * Throws on failure rather than returning invented totals. A dashboard that
 * silently shows fabricated revenue and conversion figures when the API is down
 * is worse than one that shows an error.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>('/intelligence/dashboard');
}

// ─── Admin helpers ────────────────────────────────────────────────────────────
export async function getAdminUsers(): Promise<any[]> {
  try {
    const result = await apiGet<{ users: any[] }>('/admin/users');
    return result.users || [];
  } catch {
    return [];
  }
}

export async function updateUserRole(userId: string, role: string): Promise<any> {
  return apiPatch<any>(`/admin/users/${userId}/role`, { role });
}
