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
