/**
 * Demo Auth Route — POST /api/auth/demo
 *
 * Issues a short-lived signed JWT that grants demo access to the backend.
 * The token carries a dedicated demo workspace_id and user_id so all
 * real backend routes work without a live Supabase session.
 *
 * SECURITY:
 * - Token is signed with SUPABASE_JWT_SECRET (same secret the middleware verifies)
 * - TTL is 4 hours
 * - Demo workspace is isolated; the token is scoped to it and nothing else
 * - Never exposes any real credentials to the frontend
 *
 * This endpoint is unauthenticated and mints a token the auth middleware
 * accepts, so anyone who can reach it gets API access to the demo workspace.
 * That is the point of a demo, but it must be a deliberate choice rather than a
 * default: it is therefore DISABLED unless ENABLE_DEMO_AUTH=true. The `role` in
 * the request body is caller-supplied and grants no privilege by itself — admin
 * authorisation is still decided by the profiles row for the resolved user.
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase';
import { env } from '../lib/env';

const router = Router();

// The demo workspace id is fixed; the demo USER ids are not. They were
// previously hardcoded to match rows that migration 00014 was supposed to
// insert — but that migration could never run, so the ids referred to profiles
// that did not exist and every demo request failed with "No workspace found".
// The accounts are now real auth users created by `npm run seed:demo`, and are
// resolved here by email.
export const DEMO_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

const DEMO_EMAILS = {
  admin: (process.env.DEMO_ADMIN_EMAIL || 'demo-admin@clientpilot.test').toLowerCase(),
  user: (process.env.DEMO_USER_EMAIL || 'demo-user@clientpilot.test').toLowerCase(),
} as const;

const DEMO_TOKEN_TTL_SECONDS = 4 * 60 * 60; // 4 hours

/** Demo auth is opt-in: it hands out API access without any credential. */
const isDemoAuthEnabled = (): boolean =>
  (process.env.ENABLE_DEMO_AUTH || '').trim().toLowerCase() === 'true';

/** Looks up the seeded demo profile for a role. Returns null when not seeded. */
async function resolveDemoProfile(role: 'admin' | 'user') {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id, email, role, workspace_id')
    .eq('email', DEMO_EMAILS[role])
    .maybeSingle();
  return data;
}

/**
 * POST /api/auth/demo
 * Body: { role: 'admin' | 'user' }
 * Returns: { token: string, expiresIn: number, role: string }
 */
router.post('/demo', async (req, res) => {
  if (!isDemoAuthEnabled()) {
    return res.status(404).json({
      error: 'Demo sign-in is not enabled on this server.',
      code: 'DEMO_AUTH_DISABLED',
    });
  }

  const role = req.body?.role === 'admin' ? 'admin' : 'user';

  const jwtSecret = env.supabaseJwtSecret;
  if (!jwtSecret) {
    return res.status(500).json({
      error: 'Demo auth is not configured. SUPABASE_JWT_SECRET is missing.',
    });
  }

  // Resolve the seeded demo account rather than creating rows on the fly.
  //
  // The previous implementation upserted a workspace with no owner_id and a
  // profile carrying an `email` column, inside a try/catch that logged any
  // failure as "non-fatal" and continued. Both writes always failed —
  // owner_id was NOT NULL and profiles had no email column — so this issued a
  // perfectly valid token for a workspace and profile that did not exist, and
  // every subsequent request answered 403 "No workspace found". Requiring the
  // seed to have run turns that silent breakage into a clear error.
  const profile = await resolveDemoProfile(role);

  if (!profile) {
    return res.status(503).json({
      error:
        'The demo workspace has not been seeded on this server. ' +
        'Run `npm --prefix backend run seed:demo` to create the demo accounts.',
      code: 'DEMO_NOT_SEEDED',
    });
  }

  const userId = profile.id as string;
  const email = (profile.email as string) ?? DEMO_EMAILS[role];
  const workspaceId = (profile.workspace_id as string) ?? DEMO_WORKSPACE_ID;

  // Issue JWT with the same claims Supabase uses so the auth middleware accepts it
  const payload = {
    sub: userId,
    email,
    role: 'authenticated',
    app_metadata: { role },
    user_metadata: { full_name: role === 'admin' ? 'Demo Admin' : 'Demo User' },
    // Demo-specific flag so middleware can identify demo tokens
    is_demo: true,
    demo_workspace_id: workspaceId,
    aud: 'authenticated',
    iss: 'demo.clientpilotai',
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: DEMO_TOKEN_TTL_SECONDS,
  });

  return res.json({
    token,
    expiresIn: DEMO_TOKEN_TTL_SECONDS,
    role,
    workspaceId,
  });
});

export default router;
