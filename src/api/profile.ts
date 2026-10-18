/**
 * src/api/profile.ts
 * Profile and workspace membership. Real data only — no fallbacks.
 */

import { apiGet, apiPatch } from './client';

export interface Profile {
  id: string;
  workspace_id: string | null;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'user' | string;
  avatar_url: string | null;
  timezone: string | null;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string | null;
  created_at: string;
}

export async function getProfile(): Promise<Profile> {
  const { profile } = await apiGet<{ profile: Profile }>('/profile');
  return profile;
}

/** Updates the caller's own profile. Email and role are not updatable. */
export async function updateProfile(
  updates: Partial<Pick<Profile, 'full_name' | 'timezone' | 'avatar_url'>>
): Promise<Profile> {
  const { profile } = await apiPatch<{ profile: Profile }>('/profile', updates);
  return profile;
}

export async function getWorkspace(): Promise<{ workspace: Workspace; isOwner: boolean }> {
  return apiGet<{ workspace: Workspace; isOwner: boolean }>('/workspace');
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const { members } = await apiGet<{ members: WorkspaceMember[] }>('/workspace/members');
  return members;
}
