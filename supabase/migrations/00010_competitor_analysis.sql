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
