-- Migration 00005_add_proposals.sql
-- Creates proposals table and sets up RLS and triggers

CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'submitted', 'reviewed', 'replied', 'accepted', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, lead_id)
);

-- Enable RLS on proposals
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policies for proposals
DROP POLICY IF EXISTS "Users can access proposals in their workspace" ON proposals;
CREATE POLICY "Users can access proposals in their workspace"
    ON proposals FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_proposals_modtime ON proposals;
CREATE TRIGGER update_proposals_modtime
    BEFORE UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Enable Realtime for proposals if publication exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE proposals;
        EXCEPTION WHEN duplicate_object THEN
            -- do nothing if already added
        END;
    END IF;
END$$;
-- Migration 00006_enrichment_columns.sql
-- Add contact, outreach, proposal, and metadata fields to leads table

ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_confidence DOUBLE PRECISION;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_subject TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_body TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'draft';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_generated_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_approved_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_sent_at TIMESTAMPTZ;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS proposal_content TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS proposal_status TEXT DEFAULT 'draft';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS proposal_generated_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS proposal_approved_at TIMESTAMPTZ;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_ai_model TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_enrichment_run_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS review_notes TEXT;
-- Migration 00007_outreach_messages_unique_lead.sql
-- outreach_messages had no UNIQUE constraint on lead_id.
-- ON CONFLICT upserts in /prepare and /outreach were inserting duplicates.
-- This migration deduplicates existing rows and adds the constraint.

-- Step 1: Remove duplicate rows, keeping only the most-recently created per lead
WITH ranked AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY lead_id ORDER BY created_at DESC) AS rn
    FROM outreach_messages
)
DELETE FROM outreach_messages
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Step 2: Add unique constraint so ON CONFLICT (lead_id) upserts work correctly
ALTER TABLE outreach_messages
    ADD CONSTRAINT outreach_messages_lead_id_unique UNIQUE (lead_id);
-- Migration 00008: Business Audits Table
-- Stores digital maturity evaluation, website presence, and detected digital service capabilities.

CREATE TABLE IF NOT EXISTS business_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Technical indicators ('detected' | 'not_detected' | 'unknown')
    website_exists TEXT NOT NULL DEFAULT 'unknown',
    https_enabled TEXT NOT NULL DEFAULT 'unknown',
    mobile_indicator TEXT NOT NULL DEFAULT 'unknown',
    booking_detected TEXT NOT NULL DEFAULT 'unknown',
    ordering_detected TEXT NOT NULL DEFAULT 'unknown',
    contact_form_detected TEXT NOT NULL DEFAULT 'unknown',
    social_presence_detected TEXT NOT NULL DEFAULT 'unknown',
    
    -- Digital Maturity & Score
    digital_maturity_level INT NOT NULL DEFAULT 0 CHECK (digital_maturity_level BETWEEN 0 AND 4),
    audit_score INT NOT NULL DEFAULT 0 CHECK (audit_score BETWEEN 0 AND 100),
    
    -- Explainable metrics and evidence payload
    audit_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (workspace_id, lead_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_business_audits_lead ON business_audits(lead_id);
CREATE INDEX IF NOT EXISTS idx_business_audits_workspace ON business_audits(workspace_id);
CREATE INDEX IF NOT EXISTS idx_business_audits_maturity ON business_audits(digital_maturity_level);

-- Row-Level Security
ALTER TABLE business_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access audits in their workspace"
    ON business_audits FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );
-- Migration 00009: Opportunity Analysis Table
-- Stores multi-factor opportunity scores, confidence ratings, recommended agency interventions, and explainability payloads.

CREATE TABLE IF NOT EXISTS opportunity_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Hybrid Scores (0-100)
    opportunity_score INT NOT NULL DEFAULT 0 CHECK (opportunity_score BETWEEN 0 AND 100),
    confidence_score INT NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
    
    -- Extended Dimensions (0-10)
    digital_gap_score INT NOT NULL DEFAULT 0 CHECK (digital_gap_score BETWEEN 0 AND 10),
    category_fit_score INT NOT NULL DEFAULT 0 CHECK (category_fit_score BETWEEN 0 AND 10),
    review_activity_score INT NOT NULL DEFAULT 0 CHECK (review_activity_score BETWEEN 0 AND 10),
    market_density_score INT NOT NULL DEFAULT 0 CHECK (market_density_score BETWEEN 0 AND 10),
    competitor_presence_score INT NOT NULL DEFAULT 0 CHECK (competitor_presence_score BETWEEN 0 AND 10),
    commercial_potential_score INT NOT NULL DEFAULT 0 CHECK (commercial_potential_score BETWEEN 0 AND 10),
    business_need_score INT NOT NULL DEFAULT 0 CHECK (business_need_score BETWEEN 0 AND 10),
    
    -- Maturity Levels
    current_maturity_level INT NOT NULL DEFAULT 0,
    target_maturity_level INT NOT NULL DEFAULT 2,
    maturity_gap INT NOT NULL DEFAULT 2,
    
    -- Structured Intelligence
    primary_opportunity TEXT NOT NULL DEFAULT 'Digital Presence Modernization',
    secondary_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_services JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Project Scope Preliminary Estimation
    estimated_complexity TEXT DEFAULT 'Medium',
    estimated_duration TEXT DEFAULT '3-5 weeks',
    estimated_project_range TEXT DEFAULT 'PKR 150,000 - 300,000',
    
    -- Explainable Reasoning & Evidence Layer
    reasoning JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_next_action JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (workspace_id, lead_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_opportunity_analysis_lead ON opportunity_analysis(lead_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_analysis_workspace ON opportunity_analysis(workspace_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_analysis_score ON opportunity_analysis(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_opportunity_analysis_confidence ON opportunity_analysis(confidence_score DESC);

-- Row-Level Security
ALTER TABLE opportunity_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access opportunity analysis in their workspace"
    ON opportunity_analysis FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );
-- Migration 00010: Competitor Analysis Table
-- Stores local peer comparisons, digital maturity benchmarks, and empirical competitive gap detections.

CREATE TABLE IF NOT EXISTS competitor_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Nearby Competitor Peer Data & Empirical Benchmark
    competitor_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    competitive_gap JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (workspace_id, lead_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_lead ON competitor_analysis(lead_id);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_workspace ON competitor_analysis(workspace_id);

-- Row-Level Security
ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access competitor analysis in their workspace"
    ON competitor_analysis FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );
-- Migration 00011: Outcome Events Table
-- Stores discrete operational lifecycle transitions and outcome events for correlation with AI opportunity scores.

CREATE TYPE outcome_event_type AS ENUM (
    'discovered',
    'audited',
    'qualified',
    'contacted',
    'replied',
    'meeting_booked',
    'proposal_sent',
    'accepted',
    'rejected',
    'won',
    'lost'
);

CREATE TABLE IF NOT EXISTS outcome_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    event_type outcome_event_type NOT NULL,
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'user_action', -- 'user_action' | 'system_pipeline' | 'email_outreach'
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_outcome_events_lead ON outcome_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_outcome_events_workspace ON outcome_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_outcome_events_type ON outcome_events(event_type);
CREATE INDEX IF NOT EXISTS idx_outcome_events_date ON outcome_events(event_date DESC);

-- Row-Level Security
ALTER TABLE outcome_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access outcome events in their workspace"
    ON outcome_events FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM profiles WHERE id = auth.uid()
        )
    );
-- Migration 00012: Geocoding Cache

-- NOTE: uuid_generate_v4() is schema-qualified because the uuid-ossp extension
-- lives in the `extensions` schema. Supabase happens to include that schema in
-- the default search_path, which masked the dependency — the unqualified call
-- worked there but failed on any other Postgres, so a fresh rebuild of this
-- chain aborted here. The live table's column default is already
-- extensions.uuid_generate_v4(), so this only makes the file match reality.

CREATE TABLE IF NOT EXISTS geocoding_cache (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    query TEXT NOT NULL UNIQUE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_geocoding_query ON geocoding_cache (query);
-- Migration 00013: Notifications Table

-- NOTE: uuid_generate_v4() is schema-qualified because the uuid-ossp extension
-- lives in the `extensions` schema. Supabase happens to include that schema in
-- the default search_path, which masked the dependency — the unqualified call
-- worked there but failed on any other Postgres, so a fresh rebuild of this
-- chain aborted here. The live table's column default is already
-- extensions.uuid_generate_v4(), so this only makes the file match reality.

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'lead', 'pipeline', 'outreach', 'proposal', 'system'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying unread notifications by workspace
CREATE INDEX IF NOT EXISTS idx_notifications_workspace_read ON notifications (workspace_id, read);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their workspace notifications"
    ON notifications FOR SELECT
    USING (workspace_id IN (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update their workspace notifications (e.g. mark read)"
    ON notifications FOR UPDATE
    USING (workspace_id IN (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can delete their workspace notifications"
    ON notifications FOR DELETE
    USING (workspace_id IN (
        SELECT workspace_id FROM profiles WHERE id = auth.uid()
    ));
-- Migration 00014: Demo workspace and users — SUPERSEDED, intentionally a no-op.
--
-- The original contents of this file could never run. They were written against
-- a schema that does not exist and were never applied to any environment:
--
--   1. INSERT INTO profiles (..., email, ...) — profiles has no `email` column.
--      Postgres rejects the statement with 42703 (undefined_column). The column
--      is added in 00015, after this migration.
--
--   2. The demo profile rows used hand-picked UUIDs
--      (00000000-0000-0000-0000-00000000000{2,3}) that have no matching row in
--      auth.users. profiles.id is `REFERENCES auth.users(id)`, so the inserts
--      violate that foreign key regardless of the column problem.
--
-- Because this file sits in the middle of the chain, a fresh `supabase db push`
-- or `db reset` aborted here and never reached any later migration. Emptying it
-- is what makes the chain runnable end to end; the statements are not moved to
-- a later migration because the approach itself was wrong.
--
-- Demo data is now created by `backend/src/scripts/seed-demo.ts`, which provisions
-- genuine Supabase auth users through the admin API. That keeps the auth.users
-- foreign key intact, lets the demo accounts sign in through the normal flow, and
-- keeps seed data out of the schema migration history where it does not belong.
--
--   npm --prefix backend run seed:demo
--
-- Verified against the live database on 2026-10-18: workspace
-- 00000000-0000-0000-0000-000000000001 does not exist, workspaces.owner_id is
-- still NOT NULL, and profiles.email is absent — confirming nothing here applied.

-- No statements. Deliberately left empty.
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
-- Migration 00016: rewrite the RLS policies for correctness and performance.
--
-- Three problems with the policies as originally written:
--
--   1. PERFORMANCE. Every policy embedded
--        workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
--      Both auth.uid() and that subquery are re-evaluated for each candidate
--      row, and the subquery is itself subject to the policy on `profiles`.
--      Wrapping a call in a scalar subquery — (select auth.uid()) — lets the
--      planner treat it as a one-time initplan instead, so the lookup happens
--      once per statement. On the workspace holding 343 leads this is the
--      difference between one profile lookup and 343 of them.
--
--   2. TEAM ACCESS. The policies on `workspaces` allowed only
--      `auth.uid() = owner_id`, so a member whose profile pointed at a
--      workspace they did not own could not read the workspace row at all.
--      That makes a multi-member workspace impossible, which the member list
--      and invite flow both require.
--
--   3. IMPLICIT WRITE CHECKS. The FOR ALL policies supplied only USING. Postgres
--      does reuse USING as the write check when WITH CHECK is omitted, so this
--      was not a hole — but it left the write rule implicit. Stating it makes
--      the intent reviewable, and makes it impossible to loosen reads later
--      without noticing that writes loosen too.
--
-- Semantics are otherwise unchanged: a user reaches exactly the rows belonging
-- to the workspace on their profile. Verify with:
--   npm --prefix backend run verify:rls

-- ─── workspaces ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their own workspaces"   ON public.workspaces;
DROP POLICY IF EXISTS "Users can insert their own workspaces"  ON public.workspaces;
DROP POLICY IF EXISTS "Users can update their own workspaces"  ON public.workspaces;

-- Readable by the owner and by any member assigned to it.
CREATE POLICY "Members and owners can view their workspace"
    ON public.workspaces FOR SELECT
    USING (
        owner_id = (SELECT auth.uid())
        OR id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
    );

CREATE POLICY "Users can create workspaces they own"
    ON public.workspaces FOR INSERT
    WITH CHECK (owner_id = (SELECT auth.uid()));

-- Only the owner may rename a workspace or change its settings.
CREATE POLICY "Owners can update their workspace"
    ON public.workspaces FOR UPDATE
    USING (owner_id = (SELECT auth.uid()))
    WITH CHECK (owner_id = (SELECT auth.uid()));

-- ─── profiles ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"          ON public.profiles;

CREATE POLICY "Users can view profiles in their workspace"
    ON public.profiles FOR SELECT
    USING (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

-- A user may edit only their own profile, and may not move themselves into
-- another workspace: the WITH CHECK pins workspace_id to the current value.
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (id = (SELECT auth.uid()))
    WITH CHECK (
        id = (SELECT auth.uid())
        AND workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
    );

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (id = (SELECT auth.uid()));

-- ─── Workspace-scoped tables ─────────────────────────────────────────────────
-- These all carry workspace_id, so one shape covers them.

DROP POLICY IF EXISTS "Users can access leads in their workspace" ON public.leads;
CREATE POLICY "Users can access leads in their workspace"
    ON public.leads FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can access pipeline history for their leads" ON public.pipeline_stages;
CREATE POLICY "Users can access pipeline history for their leads"
    ON public.pipeline_stages FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can access proposals in their workspace" ON public.proposals;
CREATE POLICY "Users can access proposals in their workspace"
    ON public.proposals FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can access audits in their workspace" ON public.business_audits;
CREATE POLICY "Users can access audits in their workspace"
    ON public.business_audits FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can access opportunity analysis in their workspace" ON public.opportunity_analysis;
CREATE POLICY "Users can access opportunity analysis in their workspace"
    ON public.opportunity_analysis FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can access competitor analysis in their workspace" ON public.competitor_analysis;
CREATE POLICY "Users can access competitor analysis in their workspace"
    ON public.competitor_analysis FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can access outcome events in their workspace" ON public.outcome_events;
CREATE POLICY "Users can access outcome events in their workspace"
    ON public.outcome_events FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

-- ─── Lead-scoped tables ──────────────────────────────────────────────────────
-- lead_scores and outreach_messages have no workspace_id, so access is derived
-- through leads. The original policies nested two subqueries (lead → leads →
-- profiles); resolving the workspace once collapses that to a single indexed
-- lookup against idx_leads_workspace_created.

DROP POLICY IF EXISTS "Users can access scores for their leads" ON public.lead_scores;
CREATE POLICY "Users can access scores for their leads"
    ON public.lead_scores FOR ALL
    USING (
        lead_id IN (
            SELECT id FROM public.leads
             WHERE workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    )
    WITH CHECK (
        lead_id IN (
            SELECT id FROM public.leads
             WHERE workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    );

DROP POLICY IF EXISTS "Users can access messages for their leads" ON public.outreach_messages;
CREATE POLICY "Users can access messages for their leads"
    ON public.outreach_messages FOR ALL
    USING (
        lead_id IN (
            SELECT id FROM public.leads
             WHERE workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    )
    WITH CHECK (
        lead_id IN (
            SELECT id FROM public.leads
             WHERE workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    );

-- ─── notifications ───────────────────────────────────────────────────────────
-- 00015 added user_id. A NULL user_id is a workspace-wide broadcast; a set
-- user_id addresses one person, and only that person may see or clear it.

DROP POLICY IF EXISTS "Users can view their workspace notifications"                    ON public.notifications;
DROP POLICY IF EXISTS "Users can update their workspace notifications (e.g. mark read)" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their workspace notifications"                  ON public.notifications;

CREATE POLICY "Users can view notifications addressed to them"
    ON public.notifications FOR SELECT
    USING (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
    );

CREATE POLICY "Users can mark their notifications read"
    ON public.notifications FOR UPDATE
    USING (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
    );

CREATE POLICY "Users can delete their notifications"
    ON public.notifications FOR DELETE
    USING (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
    );
-- Migration 00017: role model and the external client portal.
--
-- Two things here:
--
--   1. A checked role set, so `role` stops being free text that silently
--      accepts anything. Agency and freelancer are NOT roles — they are the
--      same product differing by workspaces.plan (added in 00015), so a
--      freelancer is a single-seat workspace and an agency a multi-seat one.
--      Encoding them as roles would duplicate every policy for no gain.
--
--   2. `client_portal_access`, which lets an agency invite its own client to
--      view that client's audit findings and proposal — and nothing else.
--
-- ─── The security model for client accounts ──────────────────────────────────
--
-- A client is an EXTERNAL party. The existing policies all read
--
--     workspace_id = get_user_workspace_id(auth.uid())
--
-- so a client whose profile pointed at the agency's workspace would read every
-- lead, score and outreach draft in it. Client profiles therefore carry
-- workspace_id IS NULL, which makes that comparison NULL — never true — so
-- every existing policy denies them by default. The failure mode of forgetting
-- a policy is then "the client sees nothing", not "the client sees everything".
--
-- Clients are deliberately granted NO policy on leads, proposals, lead_scores,
-- outreach_messages, pipeline_stages, competitor_analysis or outcome_events.
-- That is not an omission. RLS filters rows, not columns, and a single `leads`
-- row carries outreach_subject, outreach_body, proposal_content and the
-- internal opportunity score — the agency's pitch and its private assessment of
-- that very client. Granting row access would expose all of it.
--
-- Portal content is served exclusively by the backend (/api/portal/*), which
-- authorises against client_portal_access and returns an explicit allowlist of
-- safe columns. RLS here is the second line of defence: it ensures that a client
-- using the public anon key directly against PostgREST gets nothing but their
-- own access row and their own profile.

-- ─── 1. Role set ─────────────────────────────────────────────────────────────
-- 'user' is retained rather than renamed: existing rows use it and both the API
-- and the frontend branch on 'admin' vs 'user' today. Renaming would be churn
-- with no behavioural gain.

UPDATE public.profiles SET role = 'user' WHERE role IS NULL OR btrim(role) = '';

DO $$
BEGIN
    ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_role_check
        CHECK (role IN ('admin', 'user', 'client'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ─── 2. Role helper ──────────────────────────────────────────────────────────
-- SECURITY DEFINER so a policy on `profiles` can consult a role without
-- recursing into its own policy. search_path is pinned for the same reason as
-- in 00015: an unqualified name in a definer function is a privilege-escalation
-- vector. STABLE lets the planner hoist it out of per-row evaluation.

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- ─── 3. Client portal access grants ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.client_portal_access (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- The agency workspace that issued this grant.
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    -- The client's auth user. Cascades so deleting the account revokes access.
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- The single business this client may see. One grant, one lead.
    lead_id      UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    invited_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Soft revocation: keeps an audit trail of who was granted what and when.
    revoked_at   TIMESTAMPTZ,
    UNIQUE (user_id, lead_id)
);

CREATE INDEX IF NOT EXISTS idx_client_portal_access_user
    ON public.client_portal_access (user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_client_portal_access_workspace
    ON public.client_portal_access (workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_portal_access_lead
    ON public.client_portal_access (lead_id);

ALTER TABLE public.client_portal_access ENABLE ROW LEVEL SECURITY;

-- The agency manages grants for its own workspace.
DROP POLICY IF EXISTS "Workspace members manage their client grants" ON public.client_portal_access;
CREATE POLICY "Workspace members manage their client grants"
    ON public.client_portal_access FOR ALL
    USING      (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))))
    WITH CHECK (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

-- A client may see that a live grant exists for them, and nothing more. This is
-- what lets the portal tell an invited client which business they are viewing
-- without the backend having to be consulted first.
DROP POLICY IF EXISTS "Clients can see their own live grant" ON public.client_portal_access;
CREATE POLICY "Clients can see their own live grant"
    ON public.client_portal_access FOR SELECT
    USING (user_id = (SELECT auth.uid()) AND revoked_at IS NULL);

-- ─── 4. Let a client read their own profile ──────────────────────────────────
-- The 00016 policy is `workspace_id = get_user_workspace_id(auth.uid())`. For a
-- client that is NULL = NULL, which is NULL rather than true, so a client could
-- not read even their own row and the portal could not show their name.

DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON public.profiles;
CREATE POLICY "Users can view profiles in their workspace"
    ON public.profiles FOR SELECT
    USING (
        id = (SELECT auth.uid())
        OR (
            -- Clients never enumerate a workspace's members, even if some
            -- future code path gives one a workspace_id by mistake.
            (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
            AND workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    );

-- ─── 5. Harden the workspace-scoped policies against client accounts ─────────
-- Belt and braces. A client's NULL workspace_id already fails these, but if an
-- invite flow ever assigns one, these policies must still refuse. Written as an
-- explicit role test so the intent survives future edits.

DROP POLICY IF EXISTS "Users can access leads in their workspace" ON public.leads;
CREATE POLICY "Users can access leads in their workspace"
    ON public.leads FOR ALL
    USING (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
    )
    WITH CHECK (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
    );

DROP POLICY IF EXISTS "Users can access proposals in their workspace" ON public.proposals;
CREATE POLICY "Users can access proposals in their workspace"
    ON public.proposals FOR ALL
    USING (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
    )
    WITH CHECK (
        workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        AND (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
    );

DROP POLICY IF EXISTS "Users can access messages for their leads" ON public.outreach_messages;
CREATE POLICY "Users can access messages for their leads"
    ON public.outreach_messages FOR ALL
    USING (
        (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
        AND lead_id IN (
            SELECT id FROM public.leads
             WHERE workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    )
    WITH CHECK (
        (SELECT public.get_user_role((SELECT auth.uid()))) IS DISTINCT FROM 'client'
        AND lead_id IN (
            SELECT id FROM public.leads
             WHERE workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    );

-- ─── 6. Per-workspace seat limits by plan ────────────────────────────────────
-- What actually separates a freelancer from an agency. Enforcement lives in the
-- application, which can return a useful message; this records the policy in one
-- place so the API and the pricing page cannot drift apart.

CREATE OR REPLACE FUNCTION public.workspace_seat_limit(workspace UUID)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT CASE (SELECT plan FROM public.workspaces WHERE id = workspace)
        WHEN 'free'       THEN 1
        WHEN 'starter'    THEN 1
        WHEN 'agency'     THEN 5
        WHEN 'pro'        THEN 25
        WHEN 'enterprise' THEN 2147483647
        ELSE 1
    END;
$$;

COMMENT ON TABLE public.client_portal_access IS
    'Grants one external client user read access to one lead''s audit and proposal '
    'through /api/portal/*. Clients hold no RLS policy on the business tables: a '
    'leads row carries the agency''s outreach drafts and internal score for that '
    'same client, and RLS cannot filter columns.';
-- Migration 00018: Dashboards, team assignments, AI tracking, and client portal messages
--
-- 1. leads.assigned_to (UUID -> profiles.id) for multi-seat agency collaboration
-- 2. ai_usage_events for per-workspace token/cost auditing
-- 3. portal_messages for client portal communication scoped to client_portal_access grant

-- 1. Lead Assignment
ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_assigned_to
    ON public.leads(workspace_id, assigned_to)
    WHERE assigned_to IS NOT NULL;

-- 2. AI Usage Events
CREATE TABLE IF NOT EXISTS public.ai_usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    route TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_events_workspace_created
    ON public.ai_usage_events(workspace_id, created_at DESC);

ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view AI usage in their workspace" ON public.ai_usage_events;
CREATE POLICY "Users can view AI usage in their workspace"
    ON public.ai_usage_events FOR SELECT
    USING (workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid()))));

-- 3. Portal Messages (Client Portal thread scoped to a grant)
CREATE TABLE IF NOT EXISTS public.portal_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_id UUID NOT NULL REFERENCES public.client_portal_access(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_portal_messages_grant_created
    ON public.portal_messages(grant_id, created_at ASC);

ALTER TABLE public.portal_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workspace members can view messages for grants in their workspace" ON public.portal_messages;
CREATE POLICY "Workspace members can view messages for grants in their workspace"
    ON public.portal_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.client_portal_access cpa
            WHERE cpa.id = portal_messages.grant_id
              AND cpa.workspace_id = (SELECT public.get_user_workspace_id((SELECT auth.uid())))
        )
    );
-- 00019_custom_auth_support.sql
-- Migration to support custom authentication with Resend OTP email verification.
--
-- This migration ensures:
-- 1. profiles table has email, updated_at, and indexes for fast lookup
-- 2. An auth_audit_log table to track security events, OTP issues, and webhook deliveries
-- 3. Row Level Security policies remain strictly enforced

-- Ensure columns exist on profiles
ALTER TABLE IF EXISTS public.profiles
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles (LOWER(email));

-- Audit log for authentication events (OTP generated, verified, webhooks, login attempts)
CREATE TABLE IF NOT EXISTS public.auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    email TEXT,
    ip_address TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for lookup and analytics
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_email ON public.auth_audit_logs (email);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_event_type ON public.auth_audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_created_at ON public.auth_audit_logs (created_at DESC);

-- Enable RLS on auth_audit_logs so only service role can read/write
ALTER TABLE public.auth_audit_logs ENABLE ROW LEVEL SECURITY;

-- No public access to audit logs; only backend service role
CREATE POLICY "Service role full access on auth_audit_logs"
    ON public.auth_audit_logs
    FOR ALL
    USING (false);

COMMENT ON TABLE public.auth_audit_logs IS 'Audit logging for custom authentication, Resend deliveries, and security challenges.';
