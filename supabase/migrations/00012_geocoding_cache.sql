-- Migration 00012: Geocoding Cache

CREATE TABLE IF NOT EXISTS geocoding_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT NOT NULL UNIQUE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_geocoding_query ON geocoding_cache (query);
