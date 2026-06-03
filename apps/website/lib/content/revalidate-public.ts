import type { ArticleType } from "@ludecker/types";
import { getContentPublicPath, getNavHref } from "@ludecker/utils";
import { revalidatePath } from "next/cache";

/** Invalidate ISR cache for public routes affected by a CMS row. */
export function revalidatePublicContent(
  articleType: ArticleType,
  slug: string,
): void {
  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath(getNavHref(articleType));
  revalidatePath(getContentPublicPath(articleType, slug));
}
