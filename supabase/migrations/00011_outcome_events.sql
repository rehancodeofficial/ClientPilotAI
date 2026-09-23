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
