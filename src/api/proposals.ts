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

import type { Proposal } from '@/types';

export async function getProposals(): Promise<Proposal[]> {
  try {
    const result = await apiGet<{ proposals: any[] }>('/proposals');
    return (result.proposals || []).map((p: any): Proposal => ({
      id: p.id,
      leadId: p.leadId ?? p.lead_id ?? '',
      workspaceId: p.workspaceId ?? p.workspace_id ?? '',
      title: p.title ?? 'Untitled Proposal',
      content: p.content ?? '',
      status: p.status ?? 'draft',
      createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
      updatedAt: p.updatedAt ?? p.updated_at ?? new Date().toISOString(),
      leads: p.leads,
    }));
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
