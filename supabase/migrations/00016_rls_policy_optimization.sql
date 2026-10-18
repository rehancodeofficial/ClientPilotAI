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
