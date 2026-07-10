import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      // Forward /api/* to the local Vercel dev server when using `pnpm run dev`
      // alone. Uses a regex so /api-assets/* (static images under public/) is
      // NOT matched — only proper API routes like /api/services are proxied.
      // If you use `vercel dev` instead, this proxy is unused.
      // Change the target port if your Vercel dev server runs on a different port.
      "^/api/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
