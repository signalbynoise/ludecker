import type { ArticleType } from "@ludecker/types";
import {
  createLogger,
  getContentPublicPath,
  getNavHref,
} from "@ludecker/utils";
import { bumpPublicContentCache, getPublicContentGeneration } from "./public-content-cache";

const log = createLogger("content:invalidate");

/** Response headers for /api/public/* — never allow hour-long browser/CDN caching of JSON. */
export function getPublicApiCacheControl(): string {
  if (process.env.NODE_ENV !== "production") {
    return "no-store";
  }
  return "private, no-cache, must-revalidate";
}

export function getPublicApiResponseHeaders(): Record<string, string> {
  return {
    "Cache-Control": getPublicApiCacheControl(),
    "X-Content-Generation": String(getPublicContentGeneration()),
  };
}

/** Clears server memo + logs affected public paths (SPA refetch uses fresh API data). */
export function invalidatePublicContent(
  articleType: ArticleType,
  slug: string,
): void {
  const generation = bumpPublicContentCache();
  const paths = [
    "/",
    getNavHref(articleType),
    getContentPublicPath(articleType, slug),
  ];
  log.info("invalidatePublicContent", "public content cache cleared", {
    articleType,
    slug,
    generation,
    paths,
  });
}
