/**
 * src/api/messages.ts
 * Outreach message records for the whole workspace.
 */

import { apiGet } from './client';

export interface MessageRecord {
  id: string;
  leadId: string;
  leadName: string;
  leadCategory: string | null;
  leadCity: string | null;
  recipientEmail: string | null;
  subject: string;
  body: string;
  status: 'draft' | 'approved' | 'sent' | 'failed' | string;
  variant: number;
  generatedByAi: boolean;
  createdAt: string;
  updatedAt: string | null;
  sentAt: string | null;
}

export interface MessageCounts {
  total: number;
  draft: number;
  approved: number;
  sent: number;
  failed: number;
}

/**
 * Loads every outreach message in the workspace.
 *
 * Errors propagate: the page shows an error state rather than an empty table,
 * which would otherwise read as "no outreach has been sent".
 */
export async function getMessages(status?: string): Promise<{
  messages: MessageRecord[];
  counts: MessageCounts;
}> {
  const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  return apiGet<{ messages: MessageRecord[]; counts: MessageCounts }>(`/messages${query}`);
}
