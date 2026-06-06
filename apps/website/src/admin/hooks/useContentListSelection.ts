"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ContentWithTags } from "@ludecker/types";
import {
  clearVisibleIds,
  getVisibleSelectionState,
  pruneSelectedIds,
  selectAllVisibleIds,
  toggleSelectedId,
} from "@/lib/content/admin-selection";

export interface UseContentListSelectionResult {
  selectedIds: ReadonlySet<string>;
  selectedCount: number;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  isSelected: (id: string) => boolean;
  toggleOne: (id: string) => void;
  toggleAllVisible: () => void;
  clearSelection: () => void;
}

export function useContentListSelection(
  items: ContentWithTags[],
  visibleItems: ContentWithTags[],
): UseContentListSelectionResult {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const validIds = useMemo(
    () => new Set(items.map((item) => item.id)),
    [items],
  );

  const visibleIds = useMemo(
    () => visibleItems.map((item) => item.id),
    [visibleItems],
  );

  useEffect(() => {
    setSelectedIds((current) => pruneSelectedIds(current, validIds));
  }, [validIds]);

  const { allSelected: allVisibleSelected, someSelected: someVisibleSelected } =
    useMemo(
      () => getVisibleSelectionState(selectedIds, visibleIds),
      [selectedIds, visibleIds],
    );

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((current) => toggleSelectedId(current, id));
  }, []);

  const toggleAllVisible = useCallback(() => {
    setSelectedIds((current) => {
      const { allSelected } = getVisibleSelectionState(current, visibleIds);
      return allSelected
        ? clearVisibleIds(current, visibleIds)
        : selectAllVisibleIds(current, visibleIds);
    });
  }, [visibleIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    allVisibleSelected,
    someVisibleSelected,
    isSelected,
    toggleOne,
    toggleAllVisible,
    clearSelection,
  };
}
