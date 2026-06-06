import type { PublicSearchItem } from '@ludecker/types';

export function filterSearchResults(
  query: string,
  items: readonly PublicSearchItem[],
): PublicSearchItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...items];
  }

  return items.filter((item) => {
    const haystack = [item.title, item.excerpt ?? '', item.group]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export type SearchShortcutKeyEvent = {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
};

export function isSearchShortcutEvent(event: SearchShortcutKeyEvent): boolean {
  return Boolean(
    (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k',
  );
}
