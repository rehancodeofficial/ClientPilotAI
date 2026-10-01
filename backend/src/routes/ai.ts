/**
 * /api/ai — AI diagnostics routes
 *
 * GET /api/ai/test    — Standalone AgentRouter connectivity test (no auth required)
 * GET /api/ai/models  — Lists the models AgentRouter exposes to the configured key
 *
 * The API key itself is NEVER returned, echoed, or logged by these routes.
 */

import { Router } from 'express';
import { testAiConnection } from '../services/openai';
import {
  getBaseUrl,
  getResolvedModel,
  hasApiKey,
  listAvailableModels,
  resolveModelName,
} from '../lib/aiConfig';

const router = Router();

/** Non-secret snapshot of the current AI configuration. */
const describeConfig = () => ({
  key_present: hasApiKey(),
  base_url: getBaseUrl(),
  model: getResolvedModel(),
});

// GET /api/ai/test — sends a lightweight prompt to AgentRouter and reports results.
router.get('/test', async (_req, res) => {
  const startMs = Date.now();
  console.log('[AI:TestEndpoint] Starting AgentRouter connectivity test...');

  if (!hasApiKey()) {
    return res.status(503).json({
      success: false,
      error: 'AGENTROUTER_API_KEY is not set in backend/.env. Please add your API key.',
      config: describeConfig(),
      latencyMs: Date.now() - startMs,
    });
  }

  const result = await testAiConnection();
  const totalMs = Date.now() - startMs;

  if (result.success) {
    console.log(`[AI:TestEndpoint] ✅ AgentRouter is reachable (${totalMs}ms)`);
    return res.status(200).json({
      success: true,
      message: result.data.message,
      model: result.model,
      latencyMs: result.latencyMs,
      totalMs,
      config: describeConfig(),
    });
  }

  console.error(`[AI:TestEndpoint] ❌ AgentRouter test failed (${totalMs}ms): ${result.error}`);
  return res.status(503).json({
    success: false,
    error: result.error,
    model: result.model,
    latencyMs: result.latencyMs,
    totalMs,
    config: describeConfig(),
  });
});

// GET /api/ai/models — reports which models this AgentRouter key can use.
router.get('/models', async (_req, res) => {
  const startMs = Date.now();
  console.log('[AI:ModelsEndpoint] Requesting model list from AgentRouter...');

  if (!hasApiKey()) {
    return res.status(503).json({
      success: false,
      error: 'AGENTROUTER_API_KEY is not set in backend/.env. Please add your API key.',
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
      error: `Could not list AgentRouter models: ${message}`,
      config: describeConfig(),
      latencyMs: Date.now() - startMs,
    });
  }
});

export default router;
