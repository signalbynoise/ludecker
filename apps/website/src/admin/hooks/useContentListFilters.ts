"use client";

import { useMemo, useState } from "react";
import type { ContentWithTags } from "@ludecker/types";
import {
  filterContentForAdmin,
  getFilteredContentListStats,
  type ContentListArticleTypeFilter,
  type ContentListStats,
} from "@/lib/content/admin-filters";

export interface UseContentListFiltersResult {
  query: string;
  articleType: ContentListArticleTypeFilter;
  setQuery: (query: string) => void;
  setArticleType: (articleType: ContentListArticleTypeFilter) => void;
  filteredItems: ContentWithTags[];
  stats: ContentListStats;
  hasActiveFilters: boolean;
}

export function useContentListFilters(
  items: ContentWithTags[],
): UseContentListFiltersResult {
  const [query, setQuery] = useState("");
  const [articleType, setArticleType] =
    useState<ContentListArticleTypeFilter>("all");

  const filteredItems = useMemo(
    () => filterContentForAdmin(items, { query, articleType }),
    [items, query, articleType],
  );

  const stats = useMemo(
    () => getFilteredContentListStats(items, filteredItems),
    [items, filteredItems],
  );

  const hasActiveFilters = query.trim().length > 0 || articleType !== "all";

  return {
    query,
    articleType,
    setQuery,
    setArticleType,
    filteredItems,
    stats,
    hasActiveFilters,
  };
}
