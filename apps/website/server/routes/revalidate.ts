import { ARTICLE_TYPES, type ArticleType } from "@ludecker/types";
import { createLogger } from "@ludecker/utils";
import { Hono } from "hono";
import { invalidatePublicContent } from "@/lib/content/invalidate-public";

const log = createLogger("api:revalidate");
const revalidate = new Hono();

const VALID_ARTICLE_TYPES = new Set(
  ARTICLE_TYPES.map((option) => option.value),
);

function isValidArticleType(value: string): value is ArticleType {
  return VALID_ARTICLE_TYPES.has(value as ArticleType);
}

revalidate.post("/", async (c) => {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    log.error("POST", "REVALIDATE_SECRET not configured");
    return c.json({ error: "Revalidation not configured" }, 503);
  }

  const authHeader = c.req.header("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const headerSecret = c.req.header("x-revalidate-secret");
  const provided = bearer ?? headerSecret;

  if (!provided || provided !== secret) {
    log.warn("POST", "invalid secret");
    return c.json({ error: "Unauthorized" }, 401);
  }

  let body: { article_type?: string; slug?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const articleType = body.article_type?.trim();
  const slug = body.slug?.trim();

  if (!articleType || !isValidArticleType(articleType)) {
    return c.json({ error: "Invalid or missing article_type" }, 400);
  }

  if (!slug) {
    return c.json({ error: "Missing slug" }, 400);
  }

  log.info("POST", "start", { articleType, slug });
  invalidatePublicContent(articleType, slug);
  log.info("POST", "success", { articleType, slug });

  return c.json({
    revalidated: true,
    article_type: articleType,
    slug,
  });
});

export { revalidate };
