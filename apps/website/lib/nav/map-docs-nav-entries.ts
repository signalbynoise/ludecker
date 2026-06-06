import type { ContentWithTags, DocsNavEntry } from "@ludecker/types";
import { getContentPublicPath } from "@ludecker/utils";

export function mapDocsNavEntries(
  items: Pick<ContentWithTags, "slug" | "title" | "article_type">[],
): DocsNavEntry[] {
  return items.map((item) => ({
    slug: item.slug,
    label: item.title,
    href: getContentPublicPath(item.article_type, item.slug),
  }));
}
