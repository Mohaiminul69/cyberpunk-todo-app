/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Microsoft Clarity project ID (Clarity dashboard → Settings → Overview) */
  readonly VITE_CLARITY_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
