import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Server-side Supabase client (for API routes)
export const createServerSupabaseClient = () => {
  // Use service role key if available for admin operations
  const key = supabaseServiceKey || supabaseAnonKey;
  return createClient<Database>(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });
};


// Default export for convenience
export const supabase = createSupabaseClient();
