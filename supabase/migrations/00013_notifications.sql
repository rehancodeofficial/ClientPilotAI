-- Migration 00013: Notifications Table

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
