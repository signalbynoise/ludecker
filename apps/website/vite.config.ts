import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: rootDir,
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": rootDir,
      mermaid: path.join(rootDir, "../../packages/ui/node_modules/mermaid"),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  define: {
    "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
    ),
    "process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    ),
    "process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    ),
  },
  optimizeDeps: {
    exclude: ["@ludecker/ui", "@ludecker/types", "@ludecker/utils"],
    include: [
      "@tanstack/react-router",
      "@tanstack/react-query",
      "mermaid",
      "sonner",
    ],
  },
});
