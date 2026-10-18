-- Migration 00015: schema hardening — columns, indexes, and an RLS drift fix.
--
-- Every statement is idempotent so this can be re-run safely against an
-- environment where some of it already exists.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. profiles: identity columns the application already assumes exist
--
-- SettingsPage currently invents addresses like 'admin@clientpilotai.com'
-- because profiles carries no email, and the frontend (anon key) cannot read
-- auth.users. Storing the address on the profile is what lets a workspace
-- member list show real people.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email       TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url  TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone    TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT now();

-- Backfill from the authoritative source for existing rows.
UPDATE public.profiles AS p
   SET email = u.email
  FROM auth.users AS u
 WHERE u.id = p.id
   AND p.email IS DISTINCT FROM u.email;

-- One account per address. Partial so historical rows with a NULL email (and
-- the demo profiles, which may legitimately share none) do not collide.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique
    ON public.profiles (lower(email))
    WHERE email IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. workspaces: ownership and per-workspace configuration
--
-- owner_id must be nullable for the seeded demo workspace, which deliberately
-- has no single human owner. `plan` and `settings` are the columns the quota
-- enforcement and workspace-settings work depend on.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.workspaces ALTER COLUMN owner_id DROP NOT NULL;

ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS plan       TEXT        NOT NULL DEFAULT 'free';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS settings   JSONB       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
    ALTER TABLE public.workspaces
        ADD CONSTRAINT workspaces_plan_check
        CHECK (plan IN ('free', 'starter', 'agency', 'pro', 'enterprise'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. notifications: per-user delivery
--
-- The table is workspace-scoped only, so every member of a workspace sees an
-- identical feed and "mark as read" is necessarily global. user_id is nullable:
-- NULL means a workspace-wide broadcast, a value means addressed to one person.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Indexes for the core tables from 00001, which had none beyond their
--    primary keys and unique constraints.
-- ─────────────────────────────────────────────────────────────────────────────

-- GET /api/leads orders the whole workspace by created_at on every request.
CREATE INDEX IF NOT EXISTS idx_leads_workspace_created
    ON public.leads (workspace_id, created_at DESC);

-- Outreach and proposal dashboards filter by workspace plus status.
CREATE INDEX IF NOT EXISTS idx_leads_workspace_outreach_status
    ON public.leads (workspace_id, outreach_status);
CREATE INDEX IF NOT EXISTS idx_leads_workspace_proposal_status
    ON public.leads (workspace_id, proposal_status);

-- The hottest query in the application. pipeline_stages is append-only — every
-- Kanban drag adds a row — and GET /api/leads reads the entire workspace
-- history on each call to derive the current stage per lead. Without this the
-- planner has only a sequential scan plus a sort, and the cost grows with
-- pipeline activity rather than with the number of leads.
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_workspace_lead_changed
    ON public.pipeline_stages (workspace_id, lead_id, changed_at DESC);

-- Single-lead stage history (lead detail drawer).
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_lead_changed
    ON public.pipeline_stages (lead_id, changed_at DESC);

-- "Latest score for this lead" lookups.
CREATE INDEX IF NOT EXISTS idx_lead_scores_lead_created
    ON public.lead_scores (lead_id, created_at DESC);

-- Proposals module: workspace listing and per-lead lookup.
CREATE INDEX IF NOT EXISTS idx_proposals_workspace_created
    ON public.proposals (workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_lead
    ON public.proposals (lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_workspace_status
    ON public.proposals (workspace_id, status);

-- Workspace member lists, and the subquery every RLS policy performs.
CREATE INDEX IF NOT EXISTS idx_profiles_workspace
    ON public.profiles (workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner
    ON public.workspaces (owner_id);

-- Per-user notification feed, unread first.
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created
    ON public.notifications (user_id, read, created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RLS drift: geocoding_cache
--
-- The live database has RLS enabled on this table, but no migration ever
-- enabled it — so rebuilding from this chain produced a table that the public
-- anon key could read and write, since Supabase grants anon table privileges by
-- default and RLS is the only thing standing in the way. Writing a crafted row
-- here would let an attacker control the coordinates the discovery engine
-- resolves a location to, because `query` is unique and the backend trusts the
-- cached lat/lng. Declaring it here makes the migrations match production.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.geocoding_cache ENABLE ROW LEVEL SECURITY;

-- Cached geocoding results are not tenant data, so signed-in users may read
-- them. Writes stay with the service role, which bypasses RLS; no INSERT,
-- UPDATE or DELETE policy is defined, so no client can mutate the cache.
DROP POLICY IF EXISTS "Authenticated users can read the geocoding cache" ON public.geocoding_cache;
CREATE POLICY "Authenticated users can read the geocoding cache"
    ON public.geocoding_cache FOR SELECT
    TO authenticated
    USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Harden the RLS helper function
--
-- get_user_workspace_id is SECURITY DEFINER, so it runs with the privileges of
-- its owner. Created in 00004 without an explicit search_path, it resolves
-- unqualified names using the caller's search_path — the standard setup for a
-- search-path hijack, where a caller-created object shadows `profiles` and the
-- function reads it with elevated rights. Pinning search_path closes that, and
-- STABLE lets the planner call it once per statement instead of once per row.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_user_workspace_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT workspace_id FROM public.profiles WHERE id = user_id;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Keep profile email in sync on signup
--
-- Extends the 00003 trigger to persist the address and set the workspace plan.
-- The admin-by-email rule is kept exactly as it was.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    new_workspace_id uuid;
    username text;
    user_role text;
BEGIN
    username := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

    IF LOWER(new.email) = 'admin@clientpilotai.com' THEN
        user_role := 'admin';
    ELSE
        user_role := 'user';
    END IF;

    INSERT INTO public.workspaces (name, owner_id)
    VALUES (username || '''s Workspace', new.id)
    RETURNING id INTO new_workspace_id;

    INSERT INTO public.profiles (id, workspace_id, role, full_name, email)
    VALUES (new.id, new_workspace_id, user_role, username, new.email);

    RETURN new;
END;
$$;
