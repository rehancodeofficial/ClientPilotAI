-- Migration 00014: Demo Workspace and Users

-- Allow owner_id to be NULL so the demo workspace (which has no real auth user) can be inserted
ALTER TABLE workspaces ALTER COLUMN owner_id DROP NOT NULL;

-- 1. Insert Demo Workspace
INSERT INTO workspaces (id, name, owner_id, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Workspace',
    NULL,
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Admin Profile (using stable UUIDs matching backend/src/routes/auth.ts)
INSERT INTO profiles (id, workspace_id, email, full_name, role, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'admin@demo.clientpilotai',
    'Demo Admin',
    'admin',
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo User Profile
INSERT INTO profiles (id, workspace_id, email, full_name, role, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'user@demo.clientpilotai',
    'Demo User',
    'user',
    now()
)
ON CONFLICT (id) DO NOTHING;
