// Load .env before any other module reads process.env.
import 'dotenv/config';
import { app, verifySupabaseConnection } from './app';
import { resolveModelName } from './lib/aiConfig';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT} (bound to 0.0.0.0)`);
  await verifySupabaseConnection();
  // Resolve the AgentRouter chat model once at boot so background lead scoring
  // (POST /api/leads/discover) uses a model this API key can actually reach.
  await resolveModelName();
});
