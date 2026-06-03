export function toggleSelectedId(
  selectedIds: ReadonlySet<string>,
  id: string,
): Set<string> {
  const next = new Set(selectedIds);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

export function selectAllVisibleIds(
  selectedIds: ReadonlySet<string>,
  visibleIds: readonly string[],
): Set<string> {
  const next = new Set(selectedIds);
  for (const id of visibleIds) {
    next.add(id);
  }
  return next;
}

export function clearVisibleIds(
  selectedIds: ReadonlySet<string>,
  visibleIds: readonly string[],
): Set<string> {
  const next = new Set(selectedIds);
  for (const id of visibleIds) {
    next.delete(id);
  }
  return next;
}

export function pruneSelectedIds(
  selectedIds: ReadonlySet<string>,
  validIds: ReadonlySet<string>,
): Set<string> {
  const next = new Set<string>();
  for (const id of selectedIds) {
    if (validIds.has(id)) {
      next.add(id);
    }
  }
  return next;
}

export function getVisibleSelectionState(
  selectedIds: ReadonlySet<string>,
  visibleIds: readonly string[],
): { allSelected: boolean; someSelected: boolean } {
  if (visibleIds.length === 0) {
    return { allSelected: false, someSelected: false };
  }

  let selectedVisibleCount = 0;
  for (const id of visibleIds) {
    if (selectedIds.has(id)) {
      selectedVisibleCount += 1;
    }
  }

  return {
    allSelected: selectedVisibleCount === visibleIds.length,
    someSelected:
      selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length,
  };
}
