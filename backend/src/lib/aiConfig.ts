/**
 * AI provider configuration.
 *
 * Every AI request in ClientPilot goes through an OpenAI-compatible chat
 * completions endpoint. Three providers are supported, and the one to use is
 * decided purely by which API key is present in the server environment:
 *
 *   AGENTROUTER_API_KEY → AgentRouter   (https://agentrouter.org/v1)
 *   GEMINI_API_KEY      → Google Gemini (OpenAI-compatible endpoint)
 *   OPENAI_API_KEY      → OpenAI        (https://api.openai.com/v1)
 *
 * Gemini is reached through Google's own OpenAI-compatible layer rather than
 * the @google/generative-ai SDK, so the single `client.chat.completions.create`
 * call in services/openai.ts works unchanged across all three providers.
 *
 * API keys are read ONLY from the server environment. They are never returned
 * to clients, embedded in API responses, or written to logs.
 */

import OpenAI from 'openai';

export type AiProvider = 'agentrouter' | 'gemini' | 'openai' | 'none';

export const AGENTROUTER_BASE_URL = 'https://agentrouter.org/v1';
export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai';
export const OPENAI_BASE_URL = 'https://api.openai.com/v1';

/** Kept for backwards compatibility with earlier imports. */
export const DEFAULT_BASE_URL = AGENTROUTER_BASE_URL;

/**
 * Gemini models preferred when routing through AgentRouter.
 *
 * Not used for the direct Gemini provider: Google retires model ids (2.5-flash
 * is already closed to new keys and answers HTTP 404), so the direct list lives
 * in MODEL_PREFERENCE_BY_PROVIDER and is walked as a fallback chain.
 */
export const GEMINI_MODELS: readonly string[] = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
];

/** Chat models to try, in descending order of preference, per provider. */
const MODEL_PREFERENCE_BY_PROVIDER: Record<Exclude<AiProvider, 'none'>, readonly string[]> = {
  agentrouter: [...GEMINI_MODELS, 'deepseek-v4-flash', 'gpt-6-astra', 'gpt-4o-mini'],
  gemini: [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
  ],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
};

/** Kept for backwards compatibility; reflects the active provider. */
export const MODEL_PREFERENCE: readonly string[] = MODEL_PREFERENCE_BY_PROVIDER.agentrouter;

const DEFAULT_MODEL_BY_PROVIDER: Record<Exclude<AiProvider, 'none'>, string> = {
  agentrouter: 'deepseek-v4-flash',
  gemini: 'gemini-flash-latest',
  openai: 'gpt-4o-mini',
};

export const DEFAULT_MODEL = DEFAULT_MODEL_BY_PROVIDER.agentrouter;

const read = (name: string): string => (process.env[name] || '').trim();

/**
 * The provider in use, decided by which key is configured.
 *
 * AgentRouter wins when both are set, because an explicitly configured router
 * key is a deliberate choice; Gemini is the normal single-key configuration.
 */
export const getProvider = (): AiProvider => {
  if (read('AGENTROUTER_API_KEY')) return 'agentrouter';
  if (read('GEMINI_API_KEY')) return 'gemini';
  if (read('OPENAI_API_KEY')) return 'openai';
  return 'none';
};

/** Human-readable provider name, safe to log and to show in diagnostics. */
export const getProviderLabel = (): string => {
  switch (getProvider()) {
    case 'agentrouter':
      return 'AgentRouter';
    case 'gemini':
      return 'Google Gemini';
    case 'openai':
      return 'OpenAI';
    default:
      return 'no provider configured';
  }
};

export const getApiKey = (): string => {
  switch (getProvider()) {
    case 'agentrouter':
      return read('AGENTROUTER_API_KEY');
    case 'gemini':
      return read('GEMINI_API_KEY');
    case 'openai':
      return read('OPENAI_API_KEY');
    default:
      return '';
  }
};

export const getBaseUrl = (): string => {
  const override = read('AI_BASE_URL') || read('AGENTROUTER_BASE_URL');
  const base = (() => {
    switch (getProvider()) {
      case 'agentrouter':
        return AGENTROUTER_BASE_URL;
      case 'gemini':
        return GEMINI_BASE_URL;
      case 'openai':
        return OPENAI_BASE_URL;
      default:
        return AGENTROUTER_BASE_URL;
    }
  })();
  // An explicit override only applies to the provider it was written for.
  const effective = override && getProvider() === 'agentrouter' ? override : read('AI_BASE_URL') || base;
  return effective.trim().replace(/\/+$/, '');
};

export const hasApiKey = (): boolean => getApiKey().length > 0;

/** The model name configured for the active provider, if any. */
const configuredModel = (): string => {
  switch (getProvider()) {
    case 'agentrouter':
      return read('AGENTROUTER_MODEL') || read('AI_MODEL');
    case 'gemini':
      return read('GEMINI_MODEL') || read('AI_MODEL');
    case 'openai':
      return read('OPENAI_MODEL') || read('AI_MODEL');
    default:
      return read('AI_MODEL');
  }
};

const defaultModel = (): string => {
  const provider = getProvider();
  return provider === 'none' ? DEFAULT_MODEL : DEFAULT_MODEL_BY_PROVIDER[provider];
};

let resolvedModel: string = configuredModel() || defaultModel();
let resolutionDone = false;

/** The model currently in use. Safe to call synchronously from routes. */
export const getResolvedModel = (): string => resolvedModel;

/** True once the provider has been asked which models this key can access. */
export const isModelResolved = (): boolean => resolutionDone;

/**
 * The models to try for one request, in order: the resolved model first, then
 * the rest of the provider's preference list.
 *
 * Google both retires model ids (HTTP 404 — "no longer available to new users")
 * and sheds load on free-tier keys (HTTP 503 — "experiencing high demand"), so a
 * single hard-coded model makes AI features fail for reasons that have nothing
 * to do with this application. Walking the chain keeps scoring and drafting
 * working through both.
 */
/**
 * Model ids the provider has answered 404 for in this process.
 *
 * Google keeps retired ids in its /models listing but refuses them at call
 * time, so availability cannot be trusted from the listing alone. Recording
 * them here keeps the fallback chain from spending a round trip on a model
 * already known to be gone.
 */
const retiredModels = new Set<string>();

/** Records a model the provider refused with HTTP 404. */
export const markModelRetired = (model: string): void => {
  if (model) retiredModels.add(model);
};

export const getModelFallbacks = (): string[] => {
  const provider = getProvider();
  if (provider === 'none') return [getResolvedModel()];
  const chain = [getResolvedModel(), ...MODEL_PREFERENCE_BY_PROVIDER[provider]];
  const usable = [...new Set(chain.filter((model) => model.length > 0 && !retiredModels.has(model)))];
  // Never return an empty chain: if every id has been marked retired, try the
  // configured one again rather than failing without a request.
  return usable.length > 0 ? usable : [getResolvedModel()];
};

/** Creates a fresh OpenAI SDK client pointed at the active provider. */
export const createAiClient = (apiKey: string = getApiKey()): OpenAI => {
  if (!apiKey) {
    throw new Error(
      'No AI provider key is configured. Set GEMINI_API_KEY (or AGENTROUTER_API_KEY / OPENAI_API_KEY) in the backend environment.'
    );
  }
  return new OpenAI({ apiKey, baseURL: getBaseUrl() });
};

/**
 * Fetches the model ids the active provider exposes to this API key.
 *
 * Throws on network failure or a non-2xx response. The API key is sent only in
 * the Authorization header and is never included in thrown messages.
 */
export async function listAvailableModels(): Promise<string[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No AI provider key is configured');

  const response = await fetch(`${getBaseUrl()}/models`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`${getProviderLabel()} /models responded with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { data?: Array<{ id?: unknown }> };
  return (payload.data ?? [])
    // Gemini returns ids as "models/gemini-2.5-flash"; chat completions wants
    // the bare name, and accepts either.
    .map((entry) => (typeof entry.id === 'string' ? entry.id.trim().replace(/^models\//, '') : ''))
    .filter((id) => id.length > 0);
}

/**
 * Picks the model to use by asking the provider which models this key can
 * access. The configured model wins when it is offered; otherwise the
 * highest-priority compatible model the provider actually offers is selected.
 *
 * When the key is missing or the provider is unreachable, the configured
 * default is kept so the server still boots and reports a clear error at call
 * time rather than crashing on import.
 */
export async function resolveModelName(force = false): Promise<string> {
  if (resolutionDone && !force) return resolvedModel;

  const provider = getProvider();
  const envModel = configuredModel();
  const preference = provider === 'none' ? [] : MODEL_PREFERENCE_BY_PROVIDER[provider];
  const candidates = [envModel, ...preference].filter((model) => model.length > 0);

  if (!hasApiKey()) {
    resolvedModel = envModel || defaultModel();
    console.warn(
      '[AI] No provider key is set (GEMINI_API_KEY / AGENTROUTER_API_KEY / OPENAI_API_KEY). ' +
        `Using "${resolvedModel}" until one is configured.`
    );
    return resolvedModel;
  }

  try {
    const available = await listAvailableModels();
    const match = candidates.find((candidate) => available.includes(candidate));
    resolvedModel = match ?? available[0] ?? envModel ?? defaultModel();

    if (match) {
      console.log(`[AI] ${getProviderLabel()} ready — model "${resolvedModel}".`);
    } else {
      console.warn(
        `[AI] None of the preferred models are available on ${getProviderLabel()}. ` +
          `Using "${resolvedModel}". Available: ${available.slice(0, 10).join(', ') || 'none'}`
      );
    }
  } catch (error) {
    resolvedModel = envModel || defaultModel();
    console.warn(
      `[AI] Could not verify models with ${getProviderLabel()} ` +
        `(${error instanceof Error ? error.message : String(error)}). Continuing with "${resolvedModel}".`
    );
  }

  resolutionDone = true;
  return resolvedModel;
}
