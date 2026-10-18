// `./lib/env` loads dotenv and validates configuration. It must be the first
// import so no other module reads an unvalidated process.env.
import { env, reportEnvironment, hasAnyAiKey } from './lib/env';
import { app, verifySupabaseConnection } from './app';
import { resolveModelName } from './lib/aiConfig';

reportEnvironment();

app.listen(env.PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${env.PORT} (bound to 0.0.0.0) in ${env.NODE_ENV} mode`);
  await verifySupabaseConnection();

  // Resolve the chat model once at boot so background lead scoring
  // (POST /api/leads/discover) uses a model this API key can actually reach.
  // Skipped without a key: the probe would fail and every AI route already
  // reports 503 in that state.
  if (hasAnyAiKey) {
    await resolveModelName();
  } else {
    console.warn('[AI] Skipping model resolution — no provider key configured.');
  }
});
