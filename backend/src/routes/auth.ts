/**
 * Demo Auth Route — POST /api/auth/demo
 *
 * Issues a short-lived signed JWT that grants demo access to the backend.
 * The token carries a dedicated demo workspace_id and user_id so all
 * real backend routes work without a live Supabase session.
 *
 * SECURITY:
 * - Token is signed with SUPABASE_JWT_SECRET (same secret the middleware verifies)
 * - TTL is 4 hours (short-lived, read-only demo access)
 * - Demo workspace is isolated — RLS ensures cross-tenant isolation still applies
 * - Never exposes any real credentials to the frontend
 * - Rate-limited at the app level (100 req/15min per IP)
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// These stable UUIDs identify the demo workspace + demo users.
// They are seeded in the database by migration 00014_demo_workspace.sql
export const DEMO_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';
export const DEMO_ADMIN_USER_ID = '00000000-0000-0000-0000-000000000002';
export const DEMO_USER_USER_ID  = '00000000-0000-0000-0000-000000000003';

const DEMO_TOKEN_TTL_SECONDS = 4 * 60 * 60; // 4 hours

/**
 * POST /api/auth/demo
 * Body: { role: 'admin' | 'user' }
 * Returns: { token: string, expiresIn: number, role: string }
 */
router.post('/demo', async (req, res) => {
  const role = req.body?.role === 'admin' ? 'admin' : 'user';
  const userId = role === 'admin' ? DEMO_ADMIN_USER_ID : DEMO_USER_USER_ID;
  const email = role === 'admin' ? 'admin@demo.clientpilotai' : 'user@demo.clientpilotai';

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      error: 'Demo auth is not configured. SUPABASE_JWT_SECRET is missing.',
    });
  }

  // Ensure the demo workspace exists in the database (idempotent upsert)
  try {
    await supabaseAdmin.from('workspaces').upsert({
      id: DEMO_WORKSPACE_ID,
      name: 'Demo Workspace',
    }, { onConflict: 'id', ignoreDuplicates: true });

    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      workspace_id: DEMO_WORKSPACE_ID,
      email,
      role,
      full_name: role === 'admin' ? 'Demo Admin' : 'Demo User',
    }, { onConflict: 'id', ignoreDuplicates: true });
  } catch (dbErr) {
    // Non-fatal: the workspace might already exist. Continue.
    console.warn('[DemoAuth] Workspace upsert warning:', dbErr instanceof Error ? dbErr.message : dbErr);
  }

  // Issue JWT with the same claims Supabase uses so the auth middleware accepts it
  const payload = {
    sub: userId,
    email,
    role: 'authenticated',
    app_metadata: { role },
    user_metadata: { full_name: role === 'admin' ? 'Demo Admin' : 'Demo User' },
    // Demo-specific flag so middleware can identify demo tokens
    is_demo: true,
    demo_workspace_id: DEMO_WORKSPACE_ID,
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
    workspaceId: DEMO_WORKSPACE_ID,
  });
});

export default router;
