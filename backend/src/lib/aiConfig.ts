/**
 * AgentRouter AI configuration.
 *
 * Every AI request in ClientPilot goes through AgentRouter's OpenAI-compatible
 * endpoint (https://agentrouter.org/v1). This module is the single source of
 * truth for the API key, base URL and the chat model actually in use.
 *
 * The API key is read ONLY from the server environment (AGENTROUTER_API_KEY).
 * It is never returned to clients, embedded in API responses, or written to logs.
 */

import OpenAI from 'openai';

export const DEFAULT_BASE_URL = 'https://agentrouter.org/v1';

/** Gemini models that must win when AgentRouter exposes them. */
export const GEMINI_MODELS: readonly string[] = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
];

/**
 * Chat models to try, in descending order of preference.
 *
 * `gemini-2.5-flash` is the original provider model and is tried first.
 * The remaining entries are OpenAI-compatible models that AgentRouter
 * advertises publicly (see GET https://agentrouter.org/api/pricing).
 * The first entry AgentRouter reports as available for this key wins.
 */
export const MODEL_PREFERENCE: readonly string[] = [
  ...GEMINI_MODELS,
  'deepseek-v4-flash',
  'gpt-6-astra',
  'gpt-4o-mini',
];

/** Verified-available AgentRouter model used when discovery cannot run. */
export const DEFAULT_MODEL = 'deepseek-v4-flash';

export const getBaseUrl = (): string =>
  (process.env.AGENTROUTER_BASE_URL || DEFAULT_BASE_URL).trim().replace(/\/+$/, '');

export const getApiKey = (): string => (process.env.AGENTROUTER_API_KEY || '').trim();

export const hasApiKey = (): boolean => getApiKey().length > 0;

let resolvedModel: string = (process.env.AGENTROUTER_MODEL || '').trim() || DEFAULT_MODEL;
let resolutionDone = false;

/** The model currently in use. Safe to call synchronously from routes. */
export const getResolvedModel = (): string => resolvedModel;

/** True once AgentRouter has been asked which models this key can access. */
export const isModelResolved = (): boolean => resolutionDone;

/** Creates a fresh OpenAI SDK client pointed at AgentRouter. */
export const createAiClient = (apiKey: string = getApiKey()): OpenAI => {
  if (!apiKey) {
    throw new Error('AGENTROUTER_API_KEY is not configured');
  }
  return new OpenAI({ apiKey, baseURL: getBaseUrl() });
};

/**
 * Fetches the model ids AgentRouter exposes to this API key.
 *
 * Throws on network failure or a non-2xx response. The API key is sent only
 * in the Authorization header and is never included in thrown messages.
 */
export async function listAvailableModels(): Promise<string[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('AGENTROUTER_API_KEY is not configured');

  const response = await fetch(`${getBaseUrl()}/models`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`AgentRouter /models responded with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { data?: Array<{ id?: unknown }> };
  return (payload.data ?? [])
    .map((entry) => (typeof entry.id === 'string' ? entry.id.trim() : ''))
    .filter((id) => id.length > 0);
}

/**
 * Picks the model to use by asking AgentRouter which models this key can access.
 *
 * `gemini-2.5-flash` is used when available; otherwise the highest-priority
 * compatible model AgentRouter actually offers is selected. When the API key is
 * missing or AgentRouter is unreachable the configured default is kept, so the
 * server still boots and reports a clear error at call time.
 */
export async function resolveModelName(force = false): Promise<string> {
  if (resolutionDone && !force) return resolvedModel;

  const envModel = (process.env.AGENTROUTER_MODEL || '').trim();
  const candidates = [envModel, ...MODEL_PREFERENCE].filter((model) => model.length > 0);

  if (!hasApiKey()) {
    resolvedModel = envModel || DEFAULT_MODEL;
    console.warn(
      `[AI] AGENTROUTER_API_KEY is not set. Using "${resolvedModel}" until it is configured.`
    );
    return resolvedModel;
  }

  try {
    const available = await listAvailableModels();
    const match = candidates.find((candidate) => available.includes(candidate));
    const fallback = available[0] || envModel || DEFAULT_MODEL;
    resolvedModel = match ?? fallback;

    if (match && GEMINI_MODELS.includes(match)) {
      console.log(`[AI] Model resolved to "${resolvedModel}" (preferred Gemini model available).`);
    } else if (match) {
      console.log(
        `[AI] "gemini-2.5-flash" is not offered by AgentRouter; using "${resolvedModel}" instead.`
      );
    } else {
      console.warn(
        `[AI] None of the preferred models are available for this key. Using "${resolvedModel}". ` +
          `Available: ${available.slice(0, 10).join(', ') || 'none'}`
      );
    }
  } catch (error) {
    resolvedModel = envModel || DEFAULT_MODEL;
    console.warn(
      `[AI] Could not verify models via AgentRouter /models ` +
        `(${error instanceof Error ? error.message : String(error)}). Continuing with "${resolvedModel}".`
    );
  }

  resolutionDone = true;
  return resolvedModel;
}
