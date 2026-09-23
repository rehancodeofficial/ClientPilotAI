/**
 * src/lib/apiClient.ts
 *
 * This file replaces the old apiClient.ts monolith.
 * All API functionality is now in src/api/*.
 * This file only exists to re-export and maintain backward compatibility
 * for the UI components until they are fully migrated in Phase 5.
 */

export { discoverBusinesses as discoverLeads } from '@/api/businesses';
export { runAudit as scoreLeadApi } from '@/api/audits';
export { analyzeOpportunity as scoreOpportunityApi } from '@/api/opportunities';
export { generateProposal as generateProposalApi } from '@/api/proposals';
export { getOutcomes, recordOutcome as logActivityEvent } from '@/api/outcomes';

// A few remaining helpers that aren't yet in src/api:
import { apiPost, apiGet, apiPatch } from '@/api/client';
import { updateProposalStatus } from '@/api/proposals';

// Expose updateProposalStatus with the old name for backward compatibility
export const updateProposalStatusApi = async (proposalId: string, status: any) => {
  return updateProposalStatus(proposalId, status as any);
};

// Expose saveProposalApi as a wrapper over generateProposalApi for now
export async function saveProposalApi(proposal: any) {
  return apiPost<any>(`/proposals/${proposal.leadId}/save`, { content: proposal.content });
}

export async function enrichLead(leadId: string) {
  return apiPost<any>(`/leads/${leadId}/enrich`, {});
}

export async function generateOutreach(leadId: string, customPrompt?: string) {
  return apiPost<any>(`/leads/${leadId}/outreach/generate`, { instructions: customPrompt });
}

export async function sendOutreach(leadId: string, message: any, recipientEmail: string) {
  return apiPost<any>(`/leads/${leadId}/outreach/send`, { message, recipientEmail });
}

export async function updateLeadStage(leadId: string, stage: string) {
  return apiPatch<any>(`/leads/${leadId}/stage`, { stage });
}

export async function saveDraft(leadId: string, draft: any) {
  return apiPost<any>(`/leads/${leadId}/outreach/draft`, { subject: draft.subject, body: draft.body });
}

export async function prepareLead(leadId: string, force?: boolean) {
  // Mock shim for UI backward compatibility:
  return {
    lead: { isPreparing: false },
    proposalTitle: "Prepared Proposal",
    proposalContent: "Prepared proposal content mock",
    partialError: null as string | null
  };
}

export async function getDashboardStats(): Promise<any> {
  return {
    totalLeads: 0,
    qualifiedLeads: 0,
    outreachSent: 0,
    conversionRate: 0,
    leadsPerDay: [],
    funnelData: [],
    scoreBandData: [],
    recentActivity: [],
    highValueOpportunities: 0,
    avgOpportunityScore: 0,
    avgConfidenceScore: 0,
    digitalGapsDetected: 0
  };
}
