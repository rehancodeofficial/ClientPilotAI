/**
 * AI Service — provider-agnostic chat completions
 *
 * Uses the OpenAI SDK pointed at the active provider's OpenAI-compatible chat
 * completions endpoint. Provider configuration and model selection live in
 * ../lib/aiConfig so there is a single source of truth for the API key, base
 * URL and model actually in use.
 *
 * All functions return a typed Result<T> or null so callers can surface
 * specific error messages cleanly.
 */

import { z } from 'zod';
import {
  createAiClient,
  getApiKey,
  getBaseUrl,
  getModelFallbacks,
  getProviderLabel,
  markModelBusy,
  markModelRetired,
  getResolvedModel,
  hasApiKey,
} from '../lib/aiConfig';

// ─── Result type ──────────────────────────────────────────────────────────────

export type AIResult<T> =
  | { success: true; data: T; latencyMs: number; model: string }
  | { success: false; error: string; latencyMs: number; model: string };

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ScoreSchema = z.object({
  overall_score: z.number().min(0).max(100),
  digital_presence_gap: z.number().min(0).max(10),
  category_fit: z.number().min(0).max(10),
  review_activity: z.number().min(0).max(10),
  market_density: z.number().min(0).max(10),
  competitor_presence: z.number().min(0).max(10),
  ai_reasoning: z.string(),
});

export type ScoreOutput = z.infer<typeof ScoreSchema>;

const OutreachResponseSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  follow_up: z.string(),
  whatsapp_body: z.string(),
});

export interface OutreachOutput {
  subject: string;
  body: string;
  follow_up: string;
  whatsapp_body: string;
}

const ProposalResponseSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

// ─── Error helpers ────────────────────────────────────────────────────────────

interface ApiErrorDetails {
  status: number | null;
  message: string;
}

/** Extracts the HTTP status and message from an OpenAI SDK / fetch error. */
function describeApiError(error: unknown): ApiErrorDetails {
  if (error && typeof error === 'object') {
    const candidate = error as { status?: unknown; message?: unknown };
    const status = typeof candidate.status === 'number' ? candidate.status : null;
    const message = typeof candidate.message === 'string' ? candidate.message : String(error);
    return { status, message };
  }
  return { status: null, message: String(error) };
}

/** Maps a provider failure to a safe, user-facing message (never echoes the key). */
function toUserFacingError({ status, message }: ApiErrorDetails): string {
  if (status === 401 || status === 403) {
    return `${getProviderLabel()} rejected the API key. Check that the key in backend/.env is valid and has not been revoked.`;
  }
  if (status === 402) {
    return `${getProviderLabel()} quota is exhausted. Wait for the quota to reset, or switch to a model with remaining capacity.`;
  }
  if (status === 404) {
    return `${getProviderLabel()} does not offer the configured model "${getResolvedModel()}". Set the model environment variable to one the provider lists.`;
  }
  if (status === 429) {
    return `${getProviderLabel()} rate limit reached. Please retry in a moment.`;
  }
  if (message.includes('401') || message.includes('Unauthorized') || message.includes('unauthorized')) {
    return `${getProviderLabel()} rejected the API key. Check that the key in backend/.env is valid and has not been revoked.`;
  }
  if (message.includes('402') || message.includes('quota')) {
    return `${getProviderLabel()} quota is exhausted. Wait for the quota to reset, or switch to a model with remaining capacity.`;
  }
  if (message.includes('429') || message.includes('rate limit')) {
    return `${getProviderLabel()} rate limit reached. Please retry in a moment.`;
  }
  return `${getProviderLabel()} API error: ${message}`;
}

/** True when the provider rejected `response_format` rather than the request itself. */
function isUnsupportedResponseFormat({ status, message }: ApiErrorDetails): boolean {
  const mentionsFormat = message.includes('response_format') || message.includes('json_object');
  return mentionsFormat && (status === 400 || status === 422 || status === null);
}

// ─── Shared helper ────────────────────────────────────────────────────────────

async function callAiProvider<T>(
  label: string,
  systemInstruction: string,
  userPrompt: string,
  schema: z.ZodSchema<T>
): Promise<AIResult<T>> {
  const startMs = Date.now();
  const model = getResolvedModel();

  if (!hasApiKey()) {
    return {
      success: false,
      error:
        'No AI provider key is set in backend/.env. Add GEMINI_API_KEY (or OPENAI_API_KEY).',
      latencyMs: 0,
      model,
    };
  }

  const messages = [
    {
      role: 'system' as const,
      content: `${systemInstruction}\nYou MUST respond with raw JSON only matching the schema.`,
    },
    { role: 'user' as const, content: userPrompt },
  ];

  const fallbacks = getModelFallbacks();

  console.log(
    `[AI:${label}] → Sending request to ${getProviderLabel()} (${getBaseUrl()}, model: ${model})`
  );

  try {
    const client = createAiClient(getApiKey());

    /** Sends one request, retrying without JSON mode if the model rejects it. */
    const send = async (candidate: string) => {
      try {
        return await client.chat.completions.create({
          model: candidate,
          messages,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        });
      } catch (firstError: unknown) {
        // Some models reject JSON mode; retry once without it.
        if (!isUnsupportedResponseFormat(describeApiError(firstError))) throw firstError;
        console.warn(`[AI:${label}] ⚠️  Model rejected response_format; retrying without JSON mode.`);
        return client.chat.completions.create({ model: candidate, messages, temperature: 0.3 });
      }
    };

    // Walk the fallback chain: a retired model answers 404 and an overloaded one
    // answers 503, neither of which says anything about the request itself.
    let response;
    let usedModel = model;
    let lastTransportError: unknown = null;

    for (const candidate of fallbacks) {
      try {
        response = await send(candidate);
        usedModel = candidate;
        if (candidate !== model) {
          console.warn(`[AI:${label}] ↪︎ "${model}" unavailable; served by "${candidate}".`);
        }
        break;
      } catch (err: unknown) {
        const { status } = describeApiError(err);
        if (status !== 404 && status !== 503 && status !== 429) throw err;
        // A 404 means the id is retired, not busy: do not try it again later.
        if (status === 404) markModelRetired(candidate);
        // A 429/503 is temporary, so pause this model rather than retiring it.
        else markModelBusy(candidate);
        lastTransportError = err;
        console.warn(`[AI:${label}] ⚠️  "${candidate}" returned HTTP ${status}; trying the next model.`);
      }
    }

    if (!response) throw lastTransportError ?? new Error('No model in the fallback chain responded.');

    const latencyMs = Date.now() - startMs;
    const rawText = response.choices[0]?.message?.content || '';

    if (!rawText || rawText.trim() === '') {
      console.error(`[AI:${label}] ❌ Empty response from ${getProviderLabel()} (${latencyMs}ms)`);
      return {
        success: false,
        error: `${getProviderLabel()} returned an empty response.`,
        latencyMs,
        model,
      };
    }

    console.log(
      `[AI:${label}] ← Response received from "${usedModel}" (${latencyMs}ms, ${rawText.length} chars). Parsing...`
    );

    let parsed: unknown;
    try {
      parsed = JSON.parse(stripCodeFence(rawText));
    } catch (jsonErr) {
      console.error(`[AI:${label}] ❌ JSON parse failed. Raw: ${rawText.slice(0, 200)}`);
      return {
        success: false,
        error: `Failed to parse AI response as JSON: ${jsonErr instanceof Error ? jsonErr.message : String(jsonErr)}`,
        latencyMs,
        model,
      };
    }

    const validated = schema.safeParse(parsed);
    if (!validated.success) {
      const issues = validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      console.error(`[AI:${label}] ❌ Schema validation failed: ${issues}`);
      return {
        success: false,
        error: `AI response failed schema validation: ${issues}`,
        latencyMs,
        model,
      };
    }

    console.log(`[AI:${label}] ✅ Success (${latencyMs}ms)`);
    return { success: true, data: validated.data, latencyMs, model };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startMs;
    const details = describeApiError(err);

    console.error(
      `[AI:${label}] ❌ Request failed (HTTP ${details.status ?? 'n/a'}, ${latencyMs}ms): ${details.message}`
    );
    return { success: false, error: toUserFacingError(details), latencyMs, model };
  }
}

/** Removes ```json fences some models wrap JSON responses in. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
}
// ─── Public API functions ──────────────────────────────────────────────────────

export const scoreLead = async (
  businessName: string,
  category: string,
  address: string,
  hasWebsite: boolean
): Promise<ScoreOutput | null> => {
  const result = await callAiProvider(
    'ScoreLead',
    'You are an AI lead scoring engine. Output JSON only matching: {"overall_score": 0-100, "digital_presence_gap": 0-10, "category_fit": 0-10, "review_activity": 0-10, "market_density": 0-10, "competitor_presence": 0-10, "ai_reasoning": "..."}',
    `Evaluate this business as a potential client for web development, digital transformation, or software services.

Business Name: ${businessName}
Category: ${category}
Address: ${address}
Has Website: ${hasWebsite ? 'Yes' : 'No'}

Score the lead based on their likely need for digital services. Provide a structured JSON response.`,
    ScoreSchema
  );

  if (!result.success) {
    console.error(`[AI:ScoreLead] Failed for "${businessName}": ${result.error}`);
    return null;
  }
  return result.data;
};

export const generateOutreach = async (
  businessName: string,
  category: string,
  scoreReasoning: string
): Promise<OutreachOutput | null> => {
  const result = await callAiProvider(
    'Outreach',
    'You are a B2B sales copywriter. Output JSON only: {"subject": "...", "body": "...", "follow_up": "...", "whatsapp_body": "..."}',
    `Write a personalized cold outreach package for this business owner offering software & web development services.

Business Name: ${businessName}
Category: ${category}
Reasoning: ${scoreReasoning}

Generate:
1. Email subject
2. Email body
3. Follow-up email
4. Short WhatsApp message

Return JSON: {"subject": "...", "body": "...", "follow_up": "...", "whatsapp_body": "..."}`,
    OutreachResponseSchema
  );

  if (!result.success) {
    console.error(`[AI:Outreach] Failed for "${businessName}": ${result.error}`);
    return null;
  }
  return result.data;
};

export const generateProposal = async (
  businessName: string,
  category: string,
  address: string,
  phone?: string,
  websiteUrl?: string,
  aiAnalysis?: string,
  rawOsmTags?: Record<string, unknown>
): Promise<{ title: string; content: string } | null> => {
  const result = await callAiProvider(
    'Proposal',
    'You are a professional business consultant. Output JSON only: {"title": "...", "content": "..."}',
    `Write a customized software/web services proposal for:

Business: ${businessName}
Category: ${category}
Address: ${address}
Phone: ${phone || 'N/A'}
Website: ${websiteUrl || 'None'}
Analysis: ${aiAnalysis || ''}

Return JSON: {"title": "...", "content": "...markdown content..."}`,
    ProposalResponseSchema
  );

  if (!result.success) {
    console.error(`[AI:Proposal] Failed for "${businessName}": ${result.error}`);
    return null;
  }
  return result.data;
};

export const testAiConnection = async (): Promise<AIResult<{ message: string }>> => {
  return callAiProvider(
    'ConnectivityTest',
    'You are a helpful assistant. Respond with JSON.',
    'Generate a 1-sentence friendly greeting for ClientPilot AI. Return JSON: {"message": "..."}',
    z.object({ message: z.string().min(1) })
  );
};
