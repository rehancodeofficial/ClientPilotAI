import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://emmklsvrxxhhdkxcqvmu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbWtsc3ZyeHhoaGRreGNxdm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjQ2MjYsImV4cCI6MjEwNTg0MDYyNn0.EHKAezlz2rrd1aSD69R0HlMhnP7tx5sgr6NB_48XVeM';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder.supabase.co') &&
  !supabaseUrl.includes('localhost:54321')
);

// Initialize client with project credentials
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey.trim(),
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Uploads a file to a Supabase Storage bucket and returns its public URL.
 * 
 * @param bucket Storage bucket name (e.g. 'avatars')
 * @param path Destination path inside the bucket (e.g. 'user123/avatar.png')
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}
