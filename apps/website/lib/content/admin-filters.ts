import type { ArticleType, ContentWithTags } from "@ludecker/types";
import { getContentKind } from "@ludecker/types";

export type ContentListArticleTypeFilter = ArticleType | "all";

export interface ContentListFilters {
  query: string;
  articleType: ContentListArticleTypeFilter;
}

export interface ContentListStats {
  total: number;
  filtered: number;
  pageCount: number;
  entryCount: number;
}

export function filterContentForAdmin(
  items: readonly ContentWithTags[],
  filters: ContentListFilters,
): ContentWithTags[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    if (
      filters.articleType !== "all" &&
      item.article_type !== filters.articleType
    ) {
      return false;
    }

    if (
      normalizedQuery.length > 0 &&
      !item.title.toLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }

    return true;
  });
}

function getContentListStats(
  items: readonly ContentWithTags[],
): ContentListStats {
  const pageCount = items.filter((item) => getContentKind(item) === "page").length;

  return {
    total: items.length,
    filtered: items.length,
    pageCount,
    entryCount: items.length - pageCount,
  };
}

export function getFilteredContentListStats(
  allItems: readonly ContentWithTags[],
  filteredItems: readonly ContentWithTags[],
): ContentListStats {
  const base = getContentListStats(filteredItems);

  return {
    ...base,
    total: allItems.length,
    filtered: filteredItems.length,
  };
}
