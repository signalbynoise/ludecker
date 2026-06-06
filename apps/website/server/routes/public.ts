import type { Context } from "hono";
import { Hono } from "hono";
import {
  isListableArticleType,
  resolveArticleTypeFromRouteSegment,
} from "@/lib/content/article-types";
import { fetchPageContext } from "@/lib/content/fetch-page-context";
import { getPublicApiResponseHeaders } from "@/lib/content/invalidate-public";
import {
  fetchAllPublishedSlugs,
  fetchContentBySlug,
  fetchGettingStartedEntries,
  fetchHomePageContent,
  fetchPublishedSearchIndex,
  fetchSectionEntries,
} from "@/lib/content/queries";
import {
  buildArticleMarkdownExport,
  buildHomeMarkdownExport,
} from "@/lib/content/article-markdown-export";
import { FALLBACK_HOME } from "@/lib/content/fallback";

const publicRoutes = new Hono();

function jsonWithPublicCache<T>(c: Context, body: T) {
  return c.newResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...getPublicApiResponseHeaders(),
    },
  });
}

publicRoutes.get("/home", async (c) => {
  const home = await fetchHomePageContent();
  return jsonWithPublicCache(c, home);
});

publicRoutes.get("/home/markdown", async (c) => {
  const home = (await fetchHomePageContent()) ?? FALLBACK_HOME;
  const payload = buildHomeMarkdownExport(home);
  return jsonWithPublicCache(c, payload);
});

publicRoutes.get("/getting-started", async (c) => {
  const entries = await fetchGettingStartedEntries();
  return jsonWithPublicCache(c, entries);
});

publicRoutes.get("/page-context", async (c) => {
  const pathname = c.req.query("pathname") ?? "/";
  const context = await fetchPageContext(pathname);
  return jsonWithPublicCache(c, context);
});

publicRoutes.get("/slugs", async (c) => {
  const slugs = await fetchAllPublishedSlugs();
  return jsonWithPublicCache(c, slugs);
});

publicRoutes.get("/search-index", async (c) => {
  const index = await fetchPublishedSearchIndex();
  return jsonWithPublicCache(c, index);
});

publicRoutes.get("/:typeSegment", async (c) => {
  const typeSegment = c.req.param("typeSegment");
  if (!isListableArticleType(typeSegment)) {
    return c.json({ error: "Not found" }, 404);
  }
  const articleType = resolveArticleTypeFromRouteSegment(typeSegment);
  if (!articleType || articleType === "home") {
    return c.json({ error: "Not found" }, 404);
  }
  const items = await fetchSectionEntries(articleType);
  return jsonWithPublicCache(c, items);
});

publicRoutes.get("/:typeSegment/:slug/markdown", async (c) => {
  const typeSegment = c.req.param("typeSegment");
  const slug = c.req.param("slug");
  if (!isListableArticleType(typeSegment)) {
    return c.json({ error: "Not found" }, 404);
  }
  const articleType = resolveArticleTypeFromRouteSegment(typeSegment);
  if (!articleType || articleType === "home") {
    return c.json({ error: "Not found" }, 404);
  }
  const item = await fetchContentBySlug(articleType, slug);
  if (!item) {
    return c.json({ error: "Not found" }, 404);
  }
  const payload = buildArticleMarkdownExport(item, typeSegment, slug);
  return jsonWithPublicCache(c, payload);
});

publicRoutes.get("/:typeSegment/:slug", async (c) => {
  const typeSegment = c.req.param("typeSegment");
  const slug = c.req.param("slug");
  if (!isListableArticleType(typeSegment)) {
    return c.json({ error: "Not found" }, 404);
  }
  const articleType = resolveArticleTypeFromRouteSegment(typeSegment);
  if (!articleType || articleType === "home") {
    return c.json({ error: "Not found" }, 404);
  }
  const item = await fetchContentBySlug(articleType, slug);
  if (!item) {
    return c.json({ error: "Not found" }, 404);
  }
  return jsonWithPublicCache(c, item);
});

export { publicRoutes };
