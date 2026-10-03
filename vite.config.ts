import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const repoBase = isProd ? "/" : "/";

  return {
    base: repoBase,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.png", "apple-touch-icon.png", "pwa-192x192.png", "pwa-512x512.png"],
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}"],
          navigateFallbackDenylist: [/^\/~oauth/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: { cacheName: "gstatic-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
            },
            {
              urlPattern: /^https:\/\/.*\.ytimg\.com\/.*/i,
              handler: "CacheFirst",
              options: { cacheName: "youtube-thumbnails", expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 } },
            },
          ],
        },
        manifest: {
          name: "BingBloom - Stream. Discover. Bloom.",
          short_name: "BingBloom",
          description: "Stream movies, TV shows, music, anime and live TV.",
          theme_color: "#0A0A0A",
          background_color: "#0A0A0A",
          display: "standalone",
          orientation: "portrait",
          scope: repoBase,
          start_url: repoBase,
          categories: ["entertainment", "video"],
          icons: [
            { src: `${repoBase}pwa-192x192.png`, sizes: "192x192", type: "image/png" },
            { src: `${repoBase}pwa-512x512.png`, sizes: "512x512", type: "image/png" },
            { src: `${repoBase}pwa-512x512.png`, sizes: "512x512", type: "image/png", purpose: "any maskable" },
          ],
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
