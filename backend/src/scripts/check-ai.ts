/**
 * Prints which AI provider the backend will use and whether the key works.
 *
 *   npx ts-node src/scripts/check-ai.ts
 *
 * Never prints the key itself — only the provider, base URL, model and the
 * provider's own response to a one-token test prompt.
 */
import 'dotenv/config';
import {
  getBaseUrl,
  getProvider,
  getProviderLabel,
  getResolvedModel,
  hasApiKey,
  resolveModelName,
} from '../lib/aiConfig';
import { testAiConnection } from '../services/openai';

async function main() {
  console.log(`provider : ${getProvider()} (${getProviderLabel()})`);
  console.log(`key set  : ${hasApiKey() ? 'yes' : 'no'}`);
  console.log(`base url : ${getBaseUrl()}`);

  if (!hasApiKey()) {
    console.log('\nNo provider key configured — AI endpoints will return HTTP 503.');
    return;
  }

  const model = await resolveModelName(true);
  console.log(`model    : ${model} (configured: ${getResolvedModel()})`);

  const result = await testAiConnection();
  if (result.success) {
    console.log(`\n✅ ${getProviderLabel()} responded in ${result.latencyMs} ms: ${result.data.message}`);
  } else {
    console.log(`\n❌ ${getProviderLabel()} rejected the request: ${result.error}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
