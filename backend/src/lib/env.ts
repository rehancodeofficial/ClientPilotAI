/**
 * Centralized environment validation.
 *
 * This module is the single source of truth for every environment variable the
 * backend reads. It is imported for its side effects at the very top of
 * `index.ts`, so a misconfigured deployment fails at boot with an actionable
 * message instead of throwing opaque errors on the first request.
 *
 * Two tiers:
 *   - REQUIRED   → missing or malformed values abort startup (exit 1).
 *   - OPTIONAL   → missing values log a prominent warning and disable the
 *                  feature that depends on them. The server still boots.
 *
 * Secrets are never logged. Only their presence, length and shape are reported.
 */

import 'dotenv/config';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const read = (name: string): string => (process.env[name] || '').trim();

/** Reads the first of `names` that holds a non-empty value. */
const readAny = (...names: string[]): string => {
  for (const name of names) {
    const value = read(name);
    if (value) return value;
  }
  return '';
};

const problems: string[] = [];
const warnings: string[] = [];

/**
 * Decodes a JWT payload WITHOUT verifying the signature.
 *
 * Used only to sanity-check which Supabase key was supplied. Never used for
 * authentication decisions — see `middleware/auth.ts` for verified decoding.
 */
const peekJwtPayload = (token: string): Record<string, unknown> | null => {
  const segments = token.split('.');
  if (segments.length !== 3) return null;
  try {
    const json = Buffer.from(segments[1], 'base64url').toString('utf8');
    const parsed = JSON.parse(json);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
};

// ─── Required: Supabase ───────────────────────────────────────────────────────

const supabaseUrl = readAny('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseServiceRoleKey = read('SUPABASE_SERVICE_ROLE_KEY');
const supabaseJwtSecret = read('SUPABASE_JWT_SECRET');
const supabaseAnonKey = readAny('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl) {
  problems.push(
    'SUPABASE_URL (or VITE_SUPABASE_URL) is not set. ' +
      'Copy it from Supabase → Project Settings → API → Project URL.'
  );
} else if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(supabaseUrl)) {
  // A trailing slash or an embedded path is a common copy-paste error that
  // produces confusing 404s from the REST client.
  warnings.push(
    `SUPABASE_URL ("${supabaseUrl}") does not look like a Supabase project URL ` +
      '(expected https://<project-ref>.supabase.co with no trailing slash).'
  );
}

if (!supabaseServiceRoleKey) {
  problems.push(
    'SUPABASE_SERVICE_ROLE_KEY is not set. ' +
      'Copy it from Supabase → Project Settings → API → service_role secret. ' +
      'This key bypasses RLS — set it only on the server, never in frontend env.'
  );
} else {
  const payload = peekJwtPayload(supabaseServiceRoleKey);
  if (!payload) {
    problems.push(
      'SUPABASE_SERVICE_ROLE_KEY is not a decodable JWT. ' +
        'It should be a long three-part token starting with "eyJ".'
    );
  } else if (payload.role === 'anon') {
    // Supplying the anon key here is silently catastrophic: every backend
    // query would be subject to RLS as an anonymous user and return empty
    // result sets rather than erroring.
    problems.push(
      'SUPABASE_SERVICE_ROLE_KEY contains the ANON key (role="anon"), not the service_role key. ' +
        'Backend queries would be blocked by RLS and return no rows. ' +
        'Use the service_role secret from Supabase → Project Settings → API.'
    );
  } else if (payload.role !== 'service_role') {
    warnings.push(
      `SUPABASE_SERVICE_ROLE_KEY has unexpected role "${String(payload.role)}" ` +
        '(expected "service_role").'
    );
  }
}

if (!supabaseJwtSecret) {
  problems.push(
    'SUPABASE_JWT_SECRET is not set. ' +
      'Copy it from Supabase → Project Settings → API → JWT Settings → JWT Secret. ' +
      'It is required to issue and verify demo session tokens.'
  );
} else if (supabaseJwtSecret.length < 32) {
  problems.push(
    `SUPABASE_JWT_SECRET is only ${supabaseJwtSecret.length} characters long. ` +
      'A genuine Supabase JWT secret is at least 32 characters.'
  );
}

// ─── Optional: AI provider ────────────────────────────────────────────────────
//
// AI powers lead scoring, opportunity analysis, outreach drafting and proposal
// generation. Without a key those endpoints must return a clear 503 rather than
// writing empty or placeholder rows to the database.

const geminiApiKey = read('GEMINI_API_KEY');
const openAiApiKey = read('OPENAI_API_KEY');

export const aiProviderKeys = {
  gemini: geminiApiKey,
  openAi: openAiApiKey,
};

/** True when at least one AI provider credential is present. */
export const hasAnyAiKey = Boolean(geminiApiKey || openAiApiKey);

if (!hasAnyAiKey) {
  warnings.push(
    'No AI provider key is set (GEMINI_API_KEY or OPENAI_API_KEY). ' +
      'Lead scoring, outreach generation and proposal generation will return HTTP 503.'
  );
}

if (geminiApiKey && !geminiApiKey.startsWith('AIza')) {
  warnings.push(
    'GEMINI_API_KEY does not start with "AIza". Google AI Studio keys always do; ' +
      'this key will be rejected by the Gemini API.'
  );
}

/** The provider the AI layer will actually use, for the boot summary. */
const activeAiProvider = geminiApiKey ? 'Google Gemini' : openAiApiKey ? 'OpenAI' : 'none';

// ─── Optional: email delivery ─────────────────────────────────────────────────

const resendApiKey = read('RESEND_API_KEY');
const outreachFromEmail = read('OUTREACH_FROM_EMAIL');
const resendFromEmail = readAny('RESEND_FROM_EMAIL', 'OUTREACH_FROM_EMAIL');
const resendWebhookSecret = read('RESEND_WEBHOOK_SECRET');
const appBaseUrl = readAny('APP_BASE_URL', 'FRONTEND_URL');

export const hasEmailProvider = Boolean(resendApiKey);

if (!resendApiKey) {
  warnings.push(
    'RESEND_API_KEY is not set. Outreach and authentication emails cannot be delivered; ' +
      'endpoints will simulate email dispatch.'
  );
} else if (!resendFromEmail && !outreachFromEmail) {
  warnings.push(
    'RESEND_API_KEY is set but RESEND_FROM_EMAIL is not. ' +
      'Defaulting to onboarding@resend.dev.'
  );
}

// ─── Optional: frontend origin ────────────────────────────────────────────────

const frontendUrl = readAny('FRONTEND_URL', 'APP_BASE_URL');
if (!frontendUrl) {
  warnings.push(
    'FRONTEND_URL is not set. CORS will fall back to built-in defaults, which may ' +
      'reject your production frontend origin.'
  );
}

// ─── Report & abort ───────────────────────────────────────────────────────────

const PORT = Number(read('PORT')) || 3001;
const NODE_ENV = read('NODE_ENV') || 'development';

let hasAborted = false;

/**
 * Aborts the process if any required variable is missing or malformed.
 *
 * Called from `./supabase` immediately before the service-role client is
 * constructed. That placement matters: ES import bindings are hoisted, so a
 * validation call written as a statement in the entrypoint would run *after*
 * the whole module graph — and therefore after `createClient` had already
 * thrown an opaque "supabaseUrl is required". Validating at the point of first
 * use guarantees the actionable message wins the race.
 *
 * Safe to call repeatedly; the report is printed once.
 */
export function assertRequiredEnv(): void {
  if (problems.length === 0 || hasAborted) return;
  hasAborted = true;

  console.error(
    '\n[env] FATAL — the backend cannot start because required configuration is missing:\n'
  );
  for (const problem of problems) {
    console.error(`  ✗ ${problem}`);
  }
  console.error(
    '\nSet these in backend/.env for local development, or in your hosting ' +
      "provider's environment variables for a deployment. " +
      'See backend/.env.example for the full list.\n'
  );
  process.exit(1);
}

/**
 * Prints warnings and a one-line configuration summary.
 *
 * Required-variable failures are handled by `assertRequiredEnv`, which runs
 * earlier in the import graph; this is called from the entrypoint purely so the
 * boot log states plainly which optional features are active.
 */
export function reportEnvironment(): void {
  assertRequiredEnv();

  for (const warning of warnings) {
    console.warn(`[env] WARNING  ${warning}`);
  }

  console.log(
    `[env] OK — Supabase configured (${supabaseUrl}), ` +
      `AI provider ${activeAiProvider}, ` +
      `email ${hasEmailProvider ? 'configured' : 'NOT configured'}.`
  );
}

/** True when required configuration is complete. */
export const isEnvironmentValid = (): boolean => problems.length === 0;

/** Required-variable failures found during validation. */
export const getEnvProblems = (): readonly string[] => [...problems];

// ─── Typed export ─────────────────────────────────────────────────────────────

export const env = {
  NODE_ENV,
  PORT,
  isProduction: NODE_ENV === 'production',
  supabaseUrl,
  supabaseServiceRoleKey,
  supabaseJwtSecret,
  supabaseAnonKey,
  frontendUrl,
  resendApiKey,
  outreachFromEmail,
  resendFromEmail,
  resendWebhookSecret,
  appBaseUrl,
} as const;
