/**
 * src/api/client.ts
 *
 * Central API fetch helper. All API calls must go through this module.
 *
 * Rules:
 * - NEVER returns mock data
 * - NEVER silently catches errors and substitutes fake data
 * - ALWAYS throws ApiError on failure so callers can display real error states
 * - Gets auth token from Zustand store (real Supabase OR demo JWT)
 */

import { useAppStore } from '@/store/useAppStore';

let rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim();

// Normalize the URL
if (rawApiUrl.startsWith('http')) {
  if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1);
  if (!rawApiUrl.endsWith('/api')) rawApiUrl += '/api';
} else if (!rawApiUrl.startsWith('/api')) {
  rawApiUrl = '/api';
}

export const API_BASE = rawApiUrl;

// ─── Error type ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

// ─── Token resolution ───────────────────────────────────────────────────────────

/**
 * Gets the auth token to use for API calls.
 * Priority: demo JWT stored in Zustand → real Supabase session token
 */
async function getAuthToken(): Promise<string | null> {
  // 1. Check for demo token in store
  const demoToken = useAppStore.getState().demoToken;
  if (demoToken) return demoToken;

  // 2. Fall back to real Supabase session
  try {
    const { supabase } = await import('@/lib/supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

// ─── Core fetch ────────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  if (!token) {
    throw new ApiError(401, 'NOT_AUTHENTICATED', 'No authentication token available. Please log in.');
  }

  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorCode = 'API_ERROR';
    let errorMessage = response.statusText || 'An unexpected error occurred';

    try {
      const body = await response.json();
      errorMessage = body.error || body.message || errorMessage;
      errorCode = body.code || errorCode;
    } catch {
      // Body was not JSON — use status text
    }

    throw new ApiError(response.status, errorCode, errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T>(endpoint: string, body: unknown): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}
