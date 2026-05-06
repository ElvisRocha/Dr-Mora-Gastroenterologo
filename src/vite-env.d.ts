/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_N8N_WEBHOOK_AGENDAR: string;
  readonly VITE_N8N_WEBHOOK_DISPONIBILIDAD: string;
  readonly VITE_N8N_WEBHOOK_ACTUALIZAR: string;
  readonly VITE_N8N_WEBHOOK_SEGUIMIENTO: string;
  readonly VITE_DEFAULT_LANG: "es" | "en";
  readonly VITE_TIMEZONE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
