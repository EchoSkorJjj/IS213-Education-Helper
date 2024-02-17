import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      /*
       * we need to configure the service worker so that your application can work offline.
       * To do this, we need to configure the service worker's precache manifest,
       * which will include all the resources of your application (basically we need to instruct the service worker
       * what resources to store in cache storage so that it can be used for network requests interception and when
       * the application is offline).
       * https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
       */
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },

      /*
       * https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
       * The above link also has a page for generating all the icons and images required
       */
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "My Awesome App",
        short_name: "MyApp",
        description: "My Awesome App description",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      // This allows service worker to work in development mode
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "~shared": path.resolve(__dirname, "src/shared"),
      "~models": path.resolve(__dirname, "src/shared/models"),
      "~features": path.resolve(__dirname, "src/features"),
      "~locales": path.resolve(__dirname, "src/shared/locales"),
      "~api": path.resolve(__dirname, "src/features/api/api"),
      "~types": path.resolve(__dirname, "src/shared/types"),
      "~auth": path.resolve(__dirname, "src/features/auth"),
    },
  },
});
