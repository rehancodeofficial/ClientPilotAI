/**
 * Profile and workspace-membership routes.
 *
 *   GET   /api/profile              the signed-in user's profile
 *   PATCH /api/profile              update own display name, timezone, avatar
 *   GET   /api/workspace            the user's workspace
 *   GET   /api/workspace/members    everyone in that workspace
 *
 * These exist because the frontend had no way to read a real identity: profiles
 * carried no email column and the browser (anon key) cannot query auth.users, so
 * SettingsPage displayed invented addresses and ProfilePage's save button
 * resolved a timer and reported success without writing anything.
 *
 * Email is deliberately NOT updatable here. Changing the address of record is an
 * auth-level operation that needs re-verification; doing it behind a profile
 * PATCH would let an account's identity change without confirming the new
 * mailbox.
 */

import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { respondWithError } from '../lib/errors';

const router = Router();

/** Columns added by migration 00015 — absent on an un-migrated database. */
const MIGRATION_HINT =
  'The profiles table is missing columns added by migration 00015. Apply ' +
  'supabase/migrations/00015_hardening_columns_indexes_rls.sql and retry.';

const isMissingColumn = (message: string | undefined): boolean =>
  !!message && /column .* does not exist/i.test(message);

const UpdateProfileSchema = z
  .object({
    full_name: z.string().trim().min(1).max(120).optional(),
    timezone: z.string().trim().max(64).optional(),
    avatar_url: z.string().trim().max(4 * 1024 * 1024).optional().or(z.literal('')),
    phone: z.string().trim().max(32).optional(),
    bio: z.string().trim().max(500).optional(),
    job_title: z.string().trim().max(100).optional(),
  })
  .strict();

/** Resolves the caller's profile, falling back to base columns if migration 00015 has not landed yet. */
async function loadProfile(userId: string) {
  const full = await supabaseAdmin
    .from('profiles')
    .select('id, workspace_id, full_name, email, role, avatar_url, timezone, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (full.error && isMissingColumn(full.error.message)) {
    // Graceful backward compatibility with unmigrated schema
    const base = await supabaseAdmin
      .from('profiles')
      .select('id, workspace_id, full_name, role, created_at')
      .eq('id', userId)
      .maybeSingle();
    return base;
  }
  return full;
}

// ─── GET /api/profile ─────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  const user = req.user!;
  try {
    const { data, error } = await loadProfile(user.sub);

    if (error) {
      if (isMissingColumn(error.message)) {
        return res.status(500).json({ error: MIGRATION_HINT, code: 'MIGRATION_REQUIRED' });
      }
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Profile not found', code: 'PROFILE_NOT_FOUND' });
    }

    // The token is the authority on the address; keep the stored copy aligned
    // so a profile created before 00015 backfills on first read.
    if (!(data as any).email && user.email) {
      try {
        await supabaseAdmin.from('profiles').update({ email: user.email }).eq('id', user.sub);
      } catch {
        // Ignored if column does not exist yet
      }
      (data as any).email = user.email;
    }

    res.json({ profile: data });
  } catch (err: unknown) {
    respondWithError(res, err, 'GET /api/profile');
  }
});

// ─── PATCH /api/profile ───────────────────────────────────────────────────────

router.patch('/', async (req, res) => {
  const user = req.user!;

  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid profile fields',
      code: 'VALIDATION_FAILED',
      details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  const updates: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };
  if (updates.avatar_url === '') updates.avatar_url = null;

  // `role` and `workspace_id` are intentionally not accepted: the schema is
  // strict, so a request trying to send them is rejected rather than ignored.
  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({ error: 'No fields to update', code: 'EMPTY_UPDATE' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', user.sub)
      .select('id, workspace_id, full_name, email, role, avatar_url, timezone, created_at')
      .maybeSingle();

    if (error) {
      if (isMissingColumn(error.message)) {
        return res.status(500).json({ error: MIGRATION_HINT, code: 'MIGRATION_REQUIRED' });
      }
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: 'Profile not found', code: 'PROFILE_NOT_FOUND' });
    }

    res.json({ profile: data });
  } catch (err: unknown) {
    respondWithError(res, err, 'PATCH /api/profile');
  }
});

export default router;

// ─── Workspace routes ─────────────────────────────────────────────────────────

export const workspaceRouter = Router();

workspaceRouter.get('/', async (req, res) => {
  const user = req.user!;
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .maybeSingle();

    if (!profile?.workspace_id) {
      return res.status(404).json({ error: 'No workspace found', code: 'NO_WORKSPACE' });
    }

    const { data, error } = await supabaseAdmin
      .from('workspaces')
      .select('id, name, owner_id, plan, created_at')
      .eq('id', profile.workspace_id)
      .maybeSingle();

    if (error) throw error;
    res.json({ workspace: data, isOwner: data?.owner_id === user.sub });
  } catch (err: unknown) {
    respondWithError(res, err, 'GET /api/workspace');
  }
});

workspaceRouter.patch('/', async (req, res) => {
  const user = req.user!;
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id, role')
      .eq('id', user.sub)
      .maybeSingle();

    if (!profile?.workspace_id) {
      return res.status(404).json({ error: 'No workspace found', code: 'NO_WORKSPACE' });
    }

    const { name, plan } = req.body;
    const updates: Record<string, any> = {};
    if (typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }
    if (typeof plan === 'string' && ['free', 'starter', 'agency', 'pro', 'enterprise'].includes(plan)) {
      updates.plan = plan;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid workspace fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('workspaces')
      .update(updates)
      .eq('id', profile.workspace_id)
      .select('id, name, owner_id, plan, created_at')
      .maybeSingle();

    if (error) throw error;
    res.json({ workspace: data });
  } catch (err: unknown) {
    respondWithError(res, err, 'PATCH /api/workspace');
  }
});

/**
 * Workspace member list with real addresses.
 *
 * Served from the backend because the email lives on a row the anon client
 * cannot reach reliably, and because `last_sign_in_at` comes from auth.users,
 * which only the service role can read.
 */
workspaceRouter.get('/members', async (req, res) => {
  const user = req.user!;
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.sub)
      .maybeSingle();

    if (!profile?.workspace_id) {
      return res.status(404).json({ error: 'No workspace found', code: 'NO_WORKSPACE' });
    }

    const { data: members, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .eq('workspace_id', profile.workspace_id)
      .order('created_at', { ascending: true });

    if (error) {
      if (isMissingColumn(error.message)) {
        return res.status(500).json({ error: MIGRATION_HINT, code: 'MIGRATION_REQUIRED' });
      }
      throw error;
    }

    // Enrich with last sign-in, which lives on auth.users.
    const enriched = await Promise.all(
      (members ?? []).map(async (member) => {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(member.id);
        return {
          ...member,
          email: member.email ?? authUser?.user?.email ?? null,
          last_sign_in_at: authUser?.user?.last_sign_in_at ?? null,
        };
      })
    );

    res.json({ members: enriched });
  } catch (err: unknown) {
    respondWithError(res, err, 'GET /api/workspace/members');
  }
});
