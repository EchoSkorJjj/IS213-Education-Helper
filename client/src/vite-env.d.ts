// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: "development" | "production";
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PROD_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_STORAGE_KEY: string;
  readonly VITE_UNSPLASH_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
