import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase';
import { env } from '../lib/env';
import {
  registerUser,
  verifyEmailOtp,
  resendEmailOtp,
  loginWithPassword,
  requestPasswordReset,
  resetPasswordWithOtp,
  changeUserPassword,
  findUserByEmail,
} from '../services/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ─── Rate Limiters ─────────────────────────────────────────────────────────────

// Login & registration attempts: 15 per 15 mins per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in a few minutes.' },
});

// OTP verification attempts: 10 per 10 mins per IP
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Please wait a few moments.' },
});

// OTP resend requests: 5 per 15 mins per IP
const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many resend requests. Please check your inbox or try again shortly.' },
});

// ─── Input Validation Schemas ──────────────────────────────────────────────────

const RegisterSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  accountType: z.enum(['agency', 'freelancer', 'client']).optional(),
});

const VerifyEmailSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  otp: z.string().trim().regex(/^\d{6}$/, 'Verification code must be exactly 6 digits'),
});

const ResendOtpSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

const ResetPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  otp: z.string().trim().regex(/^\d{6}$/, 'Reset code must be exactly 6 digits'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(128),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

// ─── Endpoints ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
router.post('/register', authLimiter, async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
      details: parsed.error.issues,
    });
  }

  try {
    const result = await registerUser(parsed.data);
    res.status(201).json({
      success: true,
      message: 'Registration initiated. Please check your email for your 6-digit verification code.',
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code || 'REGISTRATION_FAILED';
    const status = code === 'EMAIL_EXISTS' ? 409 : 500;
    res.status(status).json({ error: message, code });
  }
});

/**
 * POST /api/auth/verify-email
 */
router.post('/verify-email', otpLimiter, async (req, res) => {
  const parsed = VerifyEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
    });
  }

  try {
    const result = await verifyEmailOtp(parsed.data);
    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Welcome to ClientPilot AI!',
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code || 'VERIFICATION_FAILED';
    const status = ['INVALID_OTP', 'OTP_EXPIRED', 'MAX_ATTEMPTS_EXCEEDED'].includes(code) ? 400 : 500;
    res.status(status).json({ error: message, code });
  }
});

/**
 * POST /api/auth/resend-otp
 */
router.post('/resend-otp', resendLimiter, async (req, res) => {
  const parsed = ResendOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
    });
  }

  try {
    const result = await resendEmailOtp(parsed.data.email);
    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code || 'RESEND_FAILED';
    const status = code === 'COOLDOWN_ACTIVE' ? 429 : 400;
    res.status(status).json({
      error: message,
      code,
      waitSeconds: (err as any)?.waitSeconds,
    });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', authLimiter, async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
    });
  }

  try {
    const result = await loginWithPassword(parsed.data);
    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code || 'LOGIN_FAILED';
    const status = code === 'EMAIL_NOT_VERIFIED' ? 403 : code === 'INVALID_CREDENTIALS' ? 401 : 500;
    res.status(status).json({
      error: message,
      code,
      email: (err as any)?.email,
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (_req, res) => {
  // Stateless JWT invalidation on client
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user!;
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, workspace_id, full_name, email, role, avatar_url, timezone, created_at')
      .eq('id', user.sub)
      .maybeSingle();

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found', code: 'NOT_FOUND' });
    }

    res.status(200).json({
      user: {
        id: user.sub,
        email: user.email || profile.email,
        role: profile.role || user.role || 'user',
        fullName: profile.full_name,
        workspaceId: profile.workspace_id,
        avatarUrl: profile.avatar_url,
      },
      profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message, code: 'INTERNAL_ERROR' });
  }
});

/**
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', authLimiter, async (req, res) => {
  const parsed = ForgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
    });
  }

  try {
    const result = await requestPasswordReset(parsed.data.email);
    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message, code: 'RESET_REQUEST_FAILED' });
  }
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', otpLimiter, async (req, res) => {
  const parsed = ResetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
    });
  }

  try {
    const result = await resetPasswordWithOtp(parsed.data);
    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code || 'PASSWORD_RESET_FAILED';
    const status = ['INVALID_RESET_CODE', 'CODE_EXPIRED', 'MAX_ATTEMPTS_EXCEEDED'].includes(code) ? 400 : 500;
    res.status(status).json({ error: message, code });
  }
});

/**
 * POST /api/auth/change-password (Authenticated)
 */
router.post('/change-password', authMiddleware, async (req, res) => {
  const parsed = ChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Validation error',
      code: 'VALIDATION_FAILED',
    });
  }

  const user = req.user!;
  try {
    const result = await changeUserPassword(user.sub, parsed.data.newPassword);
    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message, code: 'PASSWORD_CHANGE_FAILED' });
  }
});

// ─── Demo Sign-In Route (Preserved for QA / evaluation) ─────────────────────────
export const DEMO_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_TOKEN_TTL_SECONDS = 4 * 60 * 60; // 4 hours

const isDemoAuthEnabled = (): boolean =>
  (process.env.ENABLE_DEMO_AUTH || '').trim().toLowerCase() === 'true';

router.post('/demo', async (req, res) => {
  if (!isDemoAuthEnabled()) {
    return res.status(404).json({
      error: 'Demo sign-in is not enabled on this server.',
      code: 'DEMO_AUTH_DISABLED',
    });
  }

  const role = req.body?.role === 'admin' ? 'admin' : 'user';
  const jwtSecret = env.supabaseJwtSecret;
  if (!jwtSecret) {
    return res.status(500).json({
      error: 'Demo auth is not configured. SUPABASE_JWT_SECRET is missing.',
    });
  }

  const demoEmail = role === 'admin' ? 'admin@clientpilotai.com' : 'user@clientpilotai.com';
  const { profile } = await findUserByEmail(demoEmail);

  let userId = profile?.id;
  let workspaceId = profile?.workspace_id || DEMO_WORKSPACE_ID;

  if (!userId) {
    // Check if seeded demo profile exists
    const { data: prof } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, workspace_id')
      .eq('role', role)
      .maybeSingle();

    if (prof) {
      userId = prof.id;
      workspaceId = prof.workspace_id || DEMO_WORKSPACE_ID;
    } else {
      userId = role === 'admin' ? '00000000-0000-0000-0000-000000000002' : '00000000-0000-0000-0000-000000000003';
    }
  }

  const payload = {
    sub: userId,
    email: demoEmail,
    role: 'authenticated',
    app_metadata: { role },
    user_metadata: { full_name: role === 'admin' ? 'Demo Admin' : 'Demo User' },
    is_demo: true,
    demo_workspace_id: workspaceId,
    aud: 'authenticated',
    iss: 'demo.clientpilotai',
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: DEMO_TOKEN_TTL_SECONDS,
  });

  return res.json({
    token,
    expiresIn: DEMO_TOKEN_TTL_SECONDS,
    role,
    workspaceId,
  });
});

export default router;
