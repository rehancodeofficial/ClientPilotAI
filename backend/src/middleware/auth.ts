import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase';
import { env } from '../lib/env';

export interface UserPayload {
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
      user?: UserPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = env.supabaseJwtSecret;

  // 1. First verify JWT with SUPABASE_JWT_SECRET
  if (jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as Record<string, unknown>;

      // Check if this is a valid token (either custom auth or demo)
      if (decoded.sub) {
        req.user = {
          sub: decoded.sub as string,
          email: decoded.email as string | undefined,
          role: ((decoded.app_metadata as any)?.role || decoded.role) as string | undefined,
          is_demo: decoded.is_demo === true,
          demo_workspace_id: decoded.demo_workspace_id as string | undefined,
        };
        return next();
      }
    } catch {
      // Secret didn't verify or token expired
    }
  }

  // 2. Fall back to Supabase auth service verification for legacy tokens
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
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
    console.error('[AuthMiddleware] Exception:', error);
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
    if (user.is_demo && user.role === 'admin') {
      return next();
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .maybeSingle();

    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin role required' });
    }

    next();
  } catch (err: unknown) {
    console.error('[AdminMiddleware] Error:', err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: 'Internal server error during authorization check' });
  }
};
