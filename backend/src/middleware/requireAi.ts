import { Request, Response, NextFunction } from 'express';
import { hasAnyAiKey } from '../lib/env';

/**
 * Rejects requests to AI-dependent endpoints when no provider key is configured.
 *
 * Without this guard a missing key surfaces as a generic 500 from deep inside
 * the provider SDK, which is indistinguishable from a real outage. Failing fast
 * with a specific code also prevents the AI routes from persisting empty or
 * placeholder analysis rows that would later be mistaken for real results.
 */
export const requireAi = (_req: Request, res: Response, next: NextFunction) => {
  if (!hasAnyAiKey) {
    return res.status(503).json({
      error:
        'AI features are not configured on this server. ' +
        'Set an AI provider key in the backend environment to enable scoring, ' +
        'outreach drafting and proposal generation.',
      code: 'AI_NOT_CONFIGURED',
    });
  }
  next();
};
