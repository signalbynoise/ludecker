import type { ArticleType } from "@ludecker/types";
import {
  createLogger,
  getContentPublicPath,
  getNavHref,
} from "@ludecker/utils";

const log = createLogger("content:invalidate");

/** Logs cache invalidation targets (replaces Next.js revalidatePath). */
export function invalidatePublicContent(
  articleType: ArticleType,
  slug: string,
): void {
  const paths = [
    "/",
    getNavHref(articleType),
    getContentPublicPath(articleType, slug),
  ];
  log.info("invalidatePublicContent", "cache bust requested", {
    articleType,
    slug,
    paths,
  });
}
