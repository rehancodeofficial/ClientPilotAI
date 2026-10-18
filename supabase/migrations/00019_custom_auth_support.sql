-- 00019_custom_auth_support.sql
-- Migration to support custom authentication with Resend OTP email verification.
--
-- This migration ensures:
-- 1. profiles table has email, updated_at, and indexes for fast lookup
-- 2. An auth_audit_log table to track security events, OTP issues, and webhook deliveries
-- 3. Row Level Security policies remain strictly enforced

-- Ensure columns exist on profiles
ALTER TABLE IF EXISTS public.profiles
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles (LOWER(email));

-- Audit log for authentication events (OTP generated, verified, webhooks, login attempts)
CREATE TABLE IF NOT EXISTS public.auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    email TEXT,
    ip_address TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for lookup and analytics
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_email ON public.auth_audit_logs (email);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_event_type ON public.auth_audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_created_at ON public.auth_audit_logs (created_at DESC);

-- Enable RLS on auth_audit_logs so only service role can read/write
ALTER TABLE public.auth_audit_logs ENABLE ROW LEVEL SECURITY;

-- No public access to audit logs; only backend service role
CREATE POLICY "Service role full access on auth_audit_logs"
    ON public.auth_audit_logs
    FOR ALL
    USING (false);

COMMENT ON TABLE public.auth_audit_logs IS 'Audit logging for custom authentication, Resend deliveries, and security challenges.';
