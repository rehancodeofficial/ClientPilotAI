/**
 * /api/ai — AI diagnostics routes
 *
 * GET /api/ai/test    — Standalone AI provider connectivity test (no auth required)
 * GET /api/ai/models  — Lists the models the active provider exposes to the key
 *
 * The API key itself is NEVER returned, echoed, or logged by these routes.
 */

import { Router } from 'express';
import { testAiConnection } from '../services/openai';
import {
  getBaseUrl,
  getProviderLabel,
  getResolvedModel,
  hasApiKey,
  listAvailableModels,
  resolveModelName,
} from '../lib/aiConfig';

const router = Router();

/** Non-secret snapshot of the current AI configuration. */
const describeConfig = () => ({
  provider: getProviderLabel(),
  key_present: hasApiKey(),
  base_url: getBaseUrl(),
  model: getResolvedModel(),
});

// GET /api/ai/test — sends a lightweight prompt to the provider and reports results.
router.get('/test', async (_req, res) => {
  const startMs = Date.now();
  console.log('[AI:TestEndpoint] Starting AI provider connectivity test...');

  if (!hasApiKey()) {
    return res.status(503).json({
      success: false,
      error:
        'No AI provider key is set. Add GEMINI_API_KEY (or OPENAI_API_KEY) to backend/.env.',
      config: describeConfig(),
      latencyMs: Date.now() - startMs,
    });
  }

  const result = await testAiConnection();
  const totalMs = Date.now() - startMs;

  if (result.success) {
    console.log(`[AI:TestEndpoint] ✅ provider is reachable (${totalMs}ms)`);
    return res.status(200).json({
      success: true,
      message: result.data.message,
      model: result.model,
      latencyMs: result.latencyMs,
      totalMs,
      config: describeConfig(),
    });
  }

  console.error(`[AI:TestEndpoint] ❌ provider test failed (${totalMs}ms): ${result.error}`);
  return res.status(503).json({
    success: false,
    error: result.error,
    model: result.model,
    latencyMs: result.latencyMs,
    totalMs,
    config: describeConfig(),
  });
});

// GET /api/ai/models — reports which models this provider key can use.
router.get('/models', async (_req, res) => {
  const startMs = Date.now();
  console.log(`[AI:ModelsEndpoint] Requesting model list from ${getProviderLabel()}...`);

  if (!hasApiKey()) {
    return res.status(503).json({
      success: false,
      error: 'No AI provider key is set in backend/.env. Add GEMINI_API_KEY (or OPENAI_API_KEY).',
      config: describeConfig(),
    });
  }

  try {
    const available = await listAvailableModels();
    const resolved = await resolveModelName(true);

    console.log(`[AI:ModelsEndpoint] ✅ ${available.length} model(s) available. Using "${resolved}".`);
    return res.status(200).json({
      success: true,
      base_url: getBaseUrl(),
      resolved_model: resolved,
      available_models: available,
      latencyMs: Date.now() - startMs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[AI:ModelsEndpoint] ❌ Failed to list models: ${message}`);
    return res.status(503).json({
      success: false,
      error: `Could not list ${getProviderLabel()} models: ${message}`,
      config: describeConfig(),
      latencyMs: Date.now() - startMs,
    });
  }
});

export default router;
