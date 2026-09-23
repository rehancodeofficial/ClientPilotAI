/**
 * src/api/proposals.ts
 * Proposal generation — uses real audit findings
 */

import { apiPost, apiGet } from './client';

export interface ProposalResult {
  id: string;
  leadId: string;
  content: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  generatedAt: string;
}

export async function generateProposal(leadId: string): Promise<ProposalResult> {
  return apiPost<ProposalResult>(`/proposals/generate`, { leadId });
}

export async function getProposals(): Promise<ProposalResult[]> {
  try {
    const result = await apiGet<{ proposals: ProposalResult[] }>('/proposals');
    return result.proposals || [];
  } catch {
    return [];
  }
}

export async function updateProposalStatus(
  proposalId: string,
  status: ProposalResult['status']
): Promise<ProposalResult> {
  return apiPost<ProposalResult>(`/proposals/${proposalId}/status`, { status });
}
