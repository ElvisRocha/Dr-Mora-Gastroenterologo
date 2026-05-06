import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url) {
  console.warn("[supabase] VITE_SUPABASE_URL no configurada — modo mock activo");
}

export const supabase = createClient(url || "https://example.supabase.co", anonKey || "public-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = () => Boolean(url && anonKey);
