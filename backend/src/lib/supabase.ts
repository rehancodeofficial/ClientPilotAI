import { createClient } from '@supabase/supabase-js';
import { assertRequiredEnv, env } from './env';

// Runs before createClient so a misconfigured deployment reports the specific
// missing variable instead of a generic "supabaseUrl is required" from the SDK.
assertRequiredEnv();

/**
 * Service role client. Bypasses Row Level Security, so it must only ever be
 * used server-side and must never be exposed through an API response.
 *
 * Credentials are validated in `./env`. A missing or malformed key aborts
 * startup there, so this module can rely on the values being present rather
 * than falling back to placeholders that would fail later at request time.
 */
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
