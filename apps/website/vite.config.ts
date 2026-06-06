import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function rawRouteProxy(): Plugin {
  const rawPattern = /^\/[^/]+\/[^/]+\/raw$/;

  return {
    name: "raw-route-proxy",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = req.url ?? "";
        const pathname = requestUrl.split("?")[0] ?? "";

        if (!rawPattern.test(pathname)) {
          next();
          return;
        }

        const proxyReq = http.request(
          {
            hostname: "localhost",
            port: 3000,
            path: requestUrl,
            method: req.method,
            headers: req.headers,
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
            proxyRes.pipe(res);
          },
        );

        proxyReq.on("error", () => {
          res.statusCode = 502;
          res.end("Bad Gateway");
        });

        req.pipe(proxyReq);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), rawRouteProxy()],
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
    include: [
      "@ludecker/ui",
      "@ludecker/types",
      "@ludecker/utils",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "mermaid",
    ],
  },
});
