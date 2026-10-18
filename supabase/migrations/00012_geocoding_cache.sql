-- Migration 00012: Geocoding Cache

-- NOTE: uuid_generate_v4() is schema-qualified because the uuid-ossp extension
-- lives in the `extensions` schema. Supabase happens to include that schema in
-- the default search_path, which masked the dependency — the unqualified call
-- worked there but failed on any other Postgres, so a fresh rebuild of this
-- chain aborted here. The live table's column default is already
-- extensions.uuid_generate_v4(), so this only makes the file match reality.

CREATE TABLE IF NOT EXISTS geocoding_cache (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    query TEXT NOT NULL UNIQUE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_geocoding_query ON geocoding_cache (query);
