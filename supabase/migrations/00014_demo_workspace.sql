-- Migration 00014: Demo Workspace and Users

-- 1. Insert Demo Workspace
INSERT INTO workspaces (id, name, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Workspace',
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
