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

import { fetchLeads, mapDbLeadToLead } from '@/api/businesses';
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

// ─── prepareLead ──────────────────────────────────────────────────────────────

interface PrepareResponse {
  lead: Record<string, unknown>;
  proposal: { title?: string | null; content?: string | null } | null;
  audit: unknown;
  opportunityAnalysis: unknown;
  competitorAnalysis: unknown;
  error: string | null;
}

/**
 * Runs the full preparation pipeline for a lead: audit, opportunity analysis,
 * competitor benchmark, outreach draft and proposal.
 *
 * This used to be a stub that returned the literal strings "Prepared Proposal"
 * and "Prepared proposal content" without calling the server at all, so the
 * drawer showed invented content and the real pipeline never ran. It now calls
 * `POST /api/leads/:id/prepare` and maps the response through the same database
 * to UI conversion the lead list uses.
 */
export async function prepareLead(leadId: string, force?: boolean) {
  const result = await apiPost<PrepareResponse>(`/leads/${leadId}/prepare`, { force: Boolean(force) });

  return {
    lead: mapDbLeadToLead(result.lead as never),
    proposalTitle: result.proposal?.title ?? null,
    proposalContent: result.proposal?.content ?? null,
    partialError: result.error ?? null,
  };
}

// ─── Intelligence helpers ─────────────────────────────────────────────────────
/**
 * Model evaluation statistics. Errors propagate so the page can report them;
 * swallowing them rendered an empty evaluation that looked like a real result.
 */
export async function getModelEvaluation(): Promise<any> {
  return apiGet<any>('/intelligence/evaluation');
}

/**
 * Opportunity zones, aggregated by area.
 *
 * Calls `/opportunities/zones`, which is where the route actually lives — the
 * previous path (`/intelligence/zones`) does not exist, and the catch-all
 * returned an empty array, so the Zones map was permanently blank with no error
 * anywhere. The response is a bare array, not `{ zones }`.
 */
export async function getOpportunityZones(): Promise<any[]> {
  const result = await apiGet<any[] | { zones: any[] }>('/opportunities/zones');
  if (Array.isArray(result)) return result;
  return result?.zones ?? [];
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
