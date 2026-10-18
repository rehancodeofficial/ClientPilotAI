#!/usr/bin/env bash
#
#   npm run verify:migrations
#
# Runs supabase/migrations/*.sql in order against a throwaway Postgres to prove
# the chain applies end to end. Supabase-specific objects (the auth schema,
# auth.uid(), the extensions schema) are stubbed so the project's own DDL is
# what gets exercised.
set -uo pipefail

PSQL_BIN=$(command -v psql || echo /opt/homebrew/bin/psql)
PGREADY_BIN=$(command -v pg_isready || echo /opt/homebrew/bin/pg_isready)
CONTAINER=cpai-migration-check
PORT=55432
PASSWORD=validate
PROJECT_DIR="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

cleanup() { docker rm -f "$CONTAINER" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

echo "Starting throwaway Postgres 15…"
docker run -d --name "$CONTAINER" \
  -e POSTGRES_PASSWORD="$PASSWORD" \
  -e POSTGRES_DB=postgres \
  -p "$PORT:5432" \
  postgres:15-alpine >/dev/null || { echo "could not start container"; exit 1; }

export PGPASSWORD="$PASSWORD"
PSQL=""$PSQL_BIN" -h 127.0.0.1 -p $PORT -U postgres -d postgres -v ON_ERROR_STOP=1 -q"

echo -n "Waiting for readiness"
for _ in $(seq 1 60); do
  if "$PGREADY_BIN" -h 127.0.0.1 -p "$PORT" -U postgres >/dev/null 2>&1; then
    echo " ready."
    break
  fi
  echo -n "."
  sleep 1
done

echo
echo "Installing Supabase-compatible stubs…"
$PSQL <<'SQL'
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Minimal stand-ins for the parts of Supabase Auth the migrations depend on.
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
    id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb
);
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

-- Roles the policies reference.
DO $$ BEGIN CREATE ROLE anon;          EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE ROLE authenticated; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE ROLE service_role;  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Supabase manages this publication; 00001 adds tables to it for Realtime.
DO $$ BEGIN CREATE PUBLICATION supabase_realtime; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
SQL
echo "  stubs installed."

echo
echo "Applying migrations in order:"
FAILED=0
for f in "$PROJECT_DIR"/supabase/migrations/*.sql; do
  name=$(basename "$f")
  if out=$($PSQL -f "$f" 2>&1); then
    printf '  ok    %s\n' "$name"
  else
    printf '  FAIL  %s\n' "$name"
    echo "$out" | sed 's/^/          /' | head -12
    FAILED=$((FAILED + 1))
  fi
done

echo
echo "Resulting schema:"
$PSQL -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" \
  | xargs printf '  tables   : %s\n'
$PSQL -t -c "SELECT count(*) FROM pg_indexes WHERE schemaname='public';" \
  | xargs printf '  indexes  : %s\n'
$PSQL -t -c "SELECT count(*) FROM pg_policies WHERE schemaname='public';" \
  | xargs printf '  policies : %s\n'
$PSQL -t -c "SELECT count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity;" \
  | xargs printf '  RLS on   : %s tables\n'

echo
echo "Tables WITHOUT row level security (should be none):"
$PSQL -t -c "SELECT '  - '||tablename FROM pg_tables WHERE schemaname='public' AND NOT rowsecurity ORDER BY 1;" \
  | sed '/^\s*$/d' || true

echo
echo "Tables with RLS but NO policy (deny-all, usually a mistake):"
$PSQL -t -c "
  SELECT '  - '||t.tablename
    FROM pg_tables t
   WHERE t.schemaname='public' AND t.rowsecurity
     AND NOT EXISTS (SELECT 1 FROM pg_policies p
                      WHERE p.schemaname='public' AND p.tablename=t.tablename)
   ORDER BY 1;" | sed '/^\s*$/d' || true

echo
echo "Index count per table:"
$PSQL -t -c "
  SELECT '  '||rpad(tablename,24)||count(*)
    FROM pg_indexes WHERE schemaname='public'
   GROUP BY tablename ORDER BY tablename;" | sed '/^\s*$/d'

echo
if [ "$FAILED" -eq 0 ]; then
  echo "RESULT: all migrations applied cleanly."
else
  echo "RESULT: $FAILED migration(s) failed."
fi
exit "$FAILED"
