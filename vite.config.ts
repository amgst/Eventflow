import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import { cartographer } from "@replit/vite-plugin-cartographer";
import { devBanner } from "@replit/vite-plugin-dev-banner";

const metaDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [cartographer(), devBanner()]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(metaDir, "client", "src"),
      "@shared": path.resolve(metaDir, "shared"),
      "@assets": path.resolve(metaDir, "attached_assets"),
    },
  },
  root: path.resolve(metaDir, "client"),
  build: {
    outDir: path.resolve(metaDir, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
