"use client";

import type { ContentWithTags } from "@ludecker/types";
import { ContentListBulkActions } from "@/app/admin/components/ContentListBulkActions";
import { ContentListTable } from "@/app/admin/components/ContentListTable";
import { ContentListToolbar } from "@/app/admin/components/ContentListToolbar";
import { useContentListBulkStatus } from "@/app/admin/hooks/useContentListBulkStatus";
import { useContentListFilters } from "@/app/admin/hooks/useContentListFilters";
import { useContentListSelection } from "@/app/admin/hooks/useContentListSelection";

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
