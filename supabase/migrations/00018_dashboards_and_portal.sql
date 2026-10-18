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
