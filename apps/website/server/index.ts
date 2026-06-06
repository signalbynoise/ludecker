import "./load-env";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "./app";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, "../dist");
const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 3000;

if (isProd) {
  app.use(
    "/*",
    serveStatic({
      root: distDir,
    }),
  );

  app.get("*", (c) => {
    if (c.req.path.startsWith("/api")) {
      return c.notFound();
    }
    const html = readFileSync(path.join(distDir, "index.html"), "utf-8");
    return c.html(html);
  });
}

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[server] listening on http://localhost:${info.port} (${isProd ? "production" : "api-only"})`);
});
