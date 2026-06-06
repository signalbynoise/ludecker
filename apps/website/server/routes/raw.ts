import { formatArticleMarkdown } from "@ludecker/utils";
import { Hono } from "hono";
import {
  isListableArticleType,
  resolveArticleTypeFromRouteSegment,
} from "@/lib/content/article-types";
import { fetchContentBySlug } from "@/lib/content/queries";
import { REVALIDATE_SECONDS, SITE_CONFIG } from "@/lib/constants";
import { buildContentPathname } from "@/lib/routing/pathname";

const raw = new Hono();

raw.get("/:type/:slug/raw", async (c) => {
  const type = c.req.param("type");
  const slug = c.req.param("slug");

  if (!isListableArticleType(type)) {
    return c.text("Not found", 404);
  }

  const articleType = resolveArticleTypeFromRouteSegment(type);
  if (!articleType || articleType === "home") {
    return c.text("Not found", 404);
  }

  const item = await fetchContentBySlug(articleType, slug);
  if (!item) {
    return c.text("Not found", 404);
  }

  const pagePath = buildContentPathname(type, slug);
  const pageUrl = `${SITE_CONFIG.url}${pagePath}`;
  const markdown = formatArticleMarkdown({
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    article_type: item.article_type,
    canonicalUrl: pageUrl,
  });

  return c.text(markdown, 200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    "Content-Disposition": `inline; filename="${slug}.md"`,
    "X-Content-Type-Options": "nosniff",
  });
});

export { raw };
