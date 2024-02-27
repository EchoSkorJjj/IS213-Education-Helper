// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TELEGRAM_BOT_API_KEY: string;
  readonly VITE_GOOGLE_MAP_API_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_LOCATIONIQ_ACCESS_TOKEN: string;
  readonly VITE_STORAGE_KEY: string;
  readonly VITE_URL_ENVIRONMENT_PREFIX: string;
  readonly VITE_MYINFO_CLIENT_ID: string;
  readonly VITE_MYINFO_REDIRECT_URL: string;
  readonly VITE_MYINFO_SCOPE: string;
  readonly VITE_MYINFO_PURPOSE_ID: string;
  readonly VITE_MYINFO_AUTH_API_URL: string;
  readonly VITE_MYINFO_METHOD: string;
  readonly VITE_UNSPLASH_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
