import { Hono } from "hono";
import {
  isListableArticleType,
  resolveArticleTypeFromRouteSegment,
} from "@/lib/content/article-types";
import { fetchPageContext } from "@/lib/content/fetch-page-context";
import {
  fetchAllPublishedSlugs,
  fetchContentBySlug,
  fetchGettingStartedEntries,
  fetchHomePageContent,
  fetchSectionEntries,
} from "@/lib/content/queries";
import { REVALIDATE_SECONDS } from "@/lib/constants";

const publicRoutes = new Hono();
const cacheHeader = `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`;

publicRoutes.get("/home", async (c) => {
  const home = await fetchHomePageContent();
  return c.json(home, 200, { "Cache-Control": cacheHeader });
});

publicRoutes.get("/getting-started", async (c) => {
  const entries = await fetchGettingStartedEntries();
  return c.json(entries, 200, { "Cache-Control": cacheHeader });
});

publicRoutes.get("/page-context", async (c) => {
  const pathname = c.req.query("pathname") ?? "/";
  const context = await fetchPageContext(pathname);
  return c.json(context, 200, { "Cache-Control": cacheHeader });
});

publicRoutes.get("/slugs", async (c) => {
  const slugs = await fetchAllPublishedSlugs();
  return c.json(slugs, 200, { "Cache-Control": cacheHeader });
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
  return c.json(items, 200, { "Cache-Control": cacheHeader });
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
  return c.json(item, 200, { "Cache-Control": cacheHeader });
});

export { publicRoutes };
