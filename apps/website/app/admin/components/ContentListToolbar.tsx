"use client";

import { ARTICLE_TYPES } from "@ludecker/types";
import type { ContentListArticleTypeFilter } from "@/lib/content/admin-filters";

export interface ContentListToolbarProps {
  query: string;
  articleType: ContentListArticleTypeFilter;
  onQueryChange: (query: string) => void;
  onArticleTypeChange: (articleType: ContentListArticleTypeFilter) => void;
}

export function ContentListToolbar({
  query,
  articleType,
  onQueryChange,
  onArticleTypeChange,
}: ContentListToolbarProps) {
  return (
    <div className="admin-list-toolbar">
      <div className="admin-list-toolbar__field">
        <label htmlFor="content-search">search</label>
        <input
          id="content-search"
          type="search"
          value={query}
          placeholder="search by name"
          autoComplete="off"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="admin-list-toolbar__field admin-list-toolbar__field--filter">
        <label htmlFor="content-type-filter">type</label>
        <select
          id="content-type-filter"
          value={articleType}
          onChange={(event) =>
            onArticleTypeChange(
              event.target.value as ContentListArticleTypeFilter,
            )
          }
        >
          <option value="all">all</option>
          {ARTICLE_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
