import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import leadsRouter from './routes/leads';
import analyticsRouter from './routes/analytics';
import adminRouter from './routes/admin';
import proposalsRouter from './routes/proposals';
import aiRouter from './routes/ai';
import auditsRouter from './routes/audits';
import opportunitiesRouter from './routes/opportunities';
import competitorsRouter from './routes/competitors';
import outcomesRouter from './routes/outcomes';
import intelligenceRouter from './routes/intelligence';
import authRouter from './routes/auth';
import { authMiddleware, adminMiddleware } from './middleware/auth';
import { supabaseAdmin } from './lib/supabase';

dotenv.config();

export const app = express();

app.set('trust proxy', 1);

// Production safe request logging middleware (never logs auth headers or body secrets)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log route, method, status, duration - never secrets or authorization headers
    console.log(`[API] ${req.method} ${req.originalUrl || req.url} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// CORS: allow production Vercel frontend + configured FRONTEND_URL + local development
const allowedOrigins = [
  'https://client-pilot-ai-psi.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const isAllowedOrigin = (origin: string): boolean => {
  if (allowedOrigins.includes(origin)) return true;
  // Allow local development patterns
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  if (/^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)) return true;
  // Allow Vercel deployments (production, preview, and branch builds)
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, curl, health checks)
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

// General API Rate Limiting (100 requests per 15 min per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Expensive AI/Discovery endpoint rate limiting (30 requests per 10 min per IP)
const expensiveOpsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded for heavy operations. Please wait a few moments.' },
});
app.use('/api/leads/discover', expensiveOpsLimiter);
app.use('/api/proposals/generate', expensiveOpsLimiter);
app.use('/api/leads/:id/prepare', expensiveOpsLimiter);

// ─── Health Checks ─────────────────────────────────────────────────────────────
// Basic liveness probe: does NOT depend on external providers or DB
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'client-pilot-ai-api',
  });
});

// Readiness probe: verifies internal service dependencies
app.get('/health/ready', async (_req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return res.status(503).json({
        status: 'degraded',
        service: 'client-pilot-ai-api',
        database: 'unreachable',
        error: error.message,
      });
    }

    res.status(200).json({
      status: 'ready',
      service: 'client-pilot-ai-api',
      database: 'connected',
    });
  } catch (err: unknown) {
    res.status(503).json({
      status: 'degraded',
      service: 'client-pilot-ai-api',
      database: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

// ─── Public routes (no JWT required) ──────────────────────────────────────────
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);

// ─── Protected API Routes ──────────────────────────────────────────────────────
app.use('/api/leads', authMiddleware, leadsRouter);
app.use('/api/proposals', authMiddleware, proposalsRouter);
app.use('/api/analytics', authMiddleware, analyticsRouter);
app.use('/api/audits', authMiddleware, auditsRouter);
app.use('/api/opportunities', authMiddleware, opportunitiesRouter);
app.use('/api/competitors', authMiddleware, competitorsRouter);
app.use('/api/outcomes', authMiddleware, outcomesRouter);
app.use('/api/intelligence', authMiddleware, intelligenceRouter);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRouter);

// ─── Centralized Error Handling Middleware ────────────────────────────────────
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ErrorMiddleware]', err instanceof Error ? err.stack : err);
  const status = (err && typeof err === 'object' && 'status' in err && typeof (err as any).status === 'number')
    ? (err as any).status
    : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';

  res.status(status).json({
    error: message,
  });
});

export const verifySupabaseConnection = async () => {
  try {
    const { error } = await supabaseAdmin.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('[Supabase] Database connection check failed:', error.message);
    } else {
      console.log('[Supabase] Database connection check successful! Connectivity is working.');
    }
  } catch (err: unknown) {
    console.error('[Supabase] Database connection check threw an exception:', err instanceof Error ? err.message : String(err));
  }
};
