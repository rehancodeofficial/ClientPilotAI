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
