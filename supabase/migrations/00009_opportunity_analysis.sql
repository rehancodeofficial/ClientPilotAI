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
