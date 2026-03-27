/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GTAG_ID?: string;
  readonly PUBLIC_GOOGLE_SCRIPT_URL?: string;
  readonly SITE_URL?: string;
  readonly LLM_API_KEY?: string;
  readonly LLM_BASE_URL?: string;
  readonly LLM_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
