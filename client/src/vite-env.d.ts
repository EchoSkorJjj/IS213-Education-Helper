// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TELEGRAM_BOT_API_KEY: string;
  readonly VITE_GOOGLE_MAP_API_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_LOCATIONIQ_ACCESS_TOKEN: string;
  readonly VITE_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
