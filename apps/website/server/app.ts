import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./routes/auth";
import { content } from "./routes/content";
import { publicRoutes } from "./routes/public";
import { raw } from "./routes/raw";
import { revalidate } from "./routes/revalidate";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
  }),
);

app.route("/api/auth", auth);
app.route("/api/content", content);
app.route("/api/public", publicRoutes);
app.route("/api/revalidate", revalidate);
app.route("/", raw);

app.get("/health", (c) => c.json({ ok: true }));

export { app };
