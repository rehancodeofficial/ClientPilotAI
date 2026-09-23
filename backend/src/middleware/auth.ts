import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase';

export interface SupabaseUserPayload {
  sub: string;
  email?: string;
  role?: string;
  is_demo?: boolean;
  demo_workspace_id?: string;
  [key: string]: unknown;
}

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: SupabaseUserPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // ── Try demo JWT first (fast path, no network call) ───────────────
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as Record<string, unknown>;

      // Accept tokens issued by our demo endpoint
      if (decoded.is_demo === true && decoded.sub && decoded.demo_workspace_id) {
        req.user = {
          sub: decoded.sub as string,
          email: decoded.email as string | undefined,
          role: decoded.role as string | undefined,
          is_demo: true,
          demo_workspace_id: decoded.demo_workspace_id as string,
        };
        return next();
      }
    } catch {
      // Not a demo token — fall through to Supabase verification
    }
  }

  // ── Verify real Supabase token ────────────────────────────────────
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      console.error('Supabase auth.getUser error:', error?.message || 'No user returned');
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = {
      sub: user.id,
      email: user.email,
      role: user.role,
      user_metadata: user.user_metadata,
    };
    next();
  } catch (error) {
    console.error('Auth middleware exception:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user || !user.sub) {
      return res.status(401).json({ error: 'Unauthorized: User session missing' });
    }

    // Demo admin bypass
    if (user.is_demo) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.sub)
        .single();
      if (profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admin role required' });
      }
      return next();
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin role required' });
    }

    next();
  } catch (err: unknown) {
    console.error('Admin middleware error:', err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: 'Internal server error during authorization check' });
  }
};
