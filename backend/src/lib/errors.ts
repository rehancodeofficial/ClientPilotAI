/**
 * Error normalisation for route handlers.
 *
 * Supabase/PostgREST failures are plain objects (`{ message, code, details,
 * hint }`), not `Error` instances. Handlers that did
 * `err instanceof Error ? err.message : 'Internal Server Error'` therefore
 * collapsed every database failure into a bare "Internal Server Error",
 * which is what the frontend saw when the deployed schema was missing tables.
 */

export interface PostgrestLikeError {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}

const isPostgrestLikeError = (err: unknown): err is PostgrestLikeError =>
  typeof err === 'object' &&
  err !== null &&
  'message' in err &&
  typeof (err as { message: unknown }).message === 'string';

/**
 * PostgREST / Postgres codes that mean something more specific than
 * "the server broke". Anything not listed stays a 500.
 */
const STATUS_BY_CODE: Record<string, number> = {
  PGRST116: 404, // no rows returned where exactly one was required
  '23505': 409, // unique constraint violation
  '23503': 409, // foreign key violation
  '22P02': 400, // invalid input syntax (e.g. malformed uuid)
  '42501': 403, // insufficient privilege / RLS denial
};

/**
 * Codes that mean the database schema does not match this build — the pending
 * migrations have not been applied to the project the backend points at.
 */
const SCHEMA_DRIFT_CODES = new Set([
  'PGRST200', // no relationship between two tables (missing FK / missing table)
  'PGRST204', // column not found in schema cache
  'PGRST205', // table not found in schema cache
  '42P01', // undefined table
  '42703', // undefined column
]);

export interface NormalizedError {
  /** HTTP status to respond with. */
  status: number;
  /** Safe, actionable message for the client. */
  message: string;
  /** Underlying provider code, when there is one. */
  code?: string;
  /** Full detail for server-side logs only — never sent to the client. */
  logDetail: string;
}

export const normalizeError = (err: unknown): NormalizedError => {
  if (isPostgrestLikeError(err)) {
    const code = err.code;
    const parts = [err.message, err.details, err.hint].filter(Boolean);
    const logDetail = code ? `[${code}] ${parts.join(' | ')}` : parts.join(' | ');

    if (code && SCHEMA_DRIFT_CODES.has(code)) {
      return {
        status: 503,
        message:
          'Database schema is out of date: a table or column this endpoint needs does not exist. ' +
          'Apply the pending migrations in supabase/migrations to the configured Supabase project.',
        code,
        logDetail,
      };
    }

    return {
      status: (code && STATUS_BY_CODE[code]) || 500,
      message: err.message,
      code,
      logDetail,
    };
  }

  if (err instanceof Error) {
    return {
      status: 500,
      message: err.message,
      logDetail: err.stack || err.message,
    };
  }

  return {
    status: 500,
    message: 'Internal Server Error',
    logDetail: String(err),
  };
};

/**
 * Logs the full failure and responds with the normalised status/message.
 * `context` identifies the handler in the logs, e.g. `GET /api/leads`.
 */
export const respondWithError = (
  res: { status: (code: number) => { json: (body: unknown) => unknown } },
  err: unknown,
  context?: string,
): void => {
  const { status, message, code, logDetail } = normalizeError(err);
  console.error(`[Error]${context ? ` ${context}` : ''} ${status} ${logDetail}`);
  res.status(status).json(code ? { error: message, code } : { error: message });
};
