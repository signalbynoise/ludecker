"use client";

import type { ContentWithTags } from "@ludecker/types";
import { ContentListBulkActions } from "@/src/admin/components/ContentListBulkActions";
import { ContentListTable } from "@/src/admin/components/ContentListTable";
import { ContentListToolbar } from "@/src/admin/components/ContentListToolbar";
import { useContentListBulkStatus } from "@/src/admin/hooks/useContentListBulkStatus";
import { useContentListFilters } from "@/src/admin/hooks/useContentListFilters";
import { useContentListSelection } from "@/src/admin/hooks/useContentListSelection";

export interface ContentListProps {
  items: ContentWithTags[];
}

export function ContentList({ items }: ContentListProps) {
  const {
    query,
    articleType,
    setQuery,
    setArticleType,
    filteredItems,
    stats,
    hasActiveFilters,
  } = useContentListFilters(items);

  const selection = useContentListSelection(items, filteredItems);
  const bulkStatus = useContentListBulkStatus();

  async function handleBulkApply() {
    const ok = await bulkStatus.applyToSelection(selection.selectedIds);
    if (ok) {
      selection.clearSelection();
    }
  }

  return (
    <>
      <ContentListToolbar
        query={query}
        articleType={articleType}
        onQueryChange={setQuery}
        onArticleTypeChange={setArticleType}
      />
      <p className="admin-hint">
        {stats.pageCount} pages · {stats.entryCount} entries
        {hasActiveFilters
          ? ` · ${stats.filtered} of ${stats.total} shown`
          : null}
      </p>
      <ContentListBulkActions
        selectedCount={selection.selectedCount}
        status={bulkStatus.status}
        applying={bulkStatus.applying}
        error={bulkStatus.error}
        onStatusChange={bulkStatus.setStatus}
        onApply={() => void handleBulkApply()}
        onClear={selection.clearSelection}
      />
      <ContentListTable
        items={filteredItems}
        isSelected={selection.isSelected}
        allVisibleSelected={selection.allVisibleSelected}
        someVisibleSelected={selection.someVisibleSelected}
        onToggleOne={selection.toggleOne}
        onToggleAllVisible={selection.toggleAllVisible}
      />
    </>
  );
}
