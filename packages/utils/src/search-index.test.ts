import { describe, expect, it } from 'vitest';
import type { PublicSearchItem } from '@ludecker/types';
import {
  filterSearchResults,
  isSearchShortcutEvent,
  type SearchShortcutKeyEvent,
} from './search-index';

const items: PublicSearchItem[] = [
  {
    id: '1',
    title: 'Agentic OS',
    excerpt: 'Architecture as code',
    href: '/articles/agentic-os',
    group: 'articles',
  },
  {
    id: '2',
    title: 'guides',
    excerpt: null,
    href: '/guide',
    group: 'Pages',
  },
];

describe('filterSearchResults', () => {
  it('returns all items when query is empty', () => {
    expect(filterSearchResults('', items)).toHaveLength(2);
  });

  it('matches title case-insensitively', () => {
    expect(filterSearchResults('agentic', items)).toEqual([items[0]]);
  });

  it('matches excerpt and group', () => {
    expect(filterSearchResults('pages', items)).toEqual([items[1]]);
  });
});

function shortcutEvent(
  key: string,
  modifiers: { metaKey?: boolean; ctrlKey?: boolean } = {},
): SearchShortcutKeyEvent {
  return { key, ...modifiers };
}

describe('isSearchShortcutEvent', () => {
  it('detects meta+k', () => {
    expect(isSearchShortcutEvent(shortcutEvent('k', { metaKey: true }))).toBe(
      true,
    );
  });

  it('detects ctrl+k', () => {
    expect(isSearchShortcutEvent(shortcutEvent('K', { ctrlKey: true }))).toBe(
      true,
    );
  });

  it('ignores k without modifier', () => {
    expect(isSearchShortcutEvent(shortcutEvent('k'))).toBe(false);
  });
});
