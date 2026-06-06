'use client';

import { useEffect, useMemo, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import type { PublicSearchItem } from '@ludecker/types';
import { filterSearchResults, isSearchShortcutEvent } from '@ludecker/utils';
import { DOCS_COMMAND_BAR_LABEL, TEXT_BODY_SM_CLASS } from './constants';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './components/ui/command';
import { DocsSearchField } from './DocsSearchField';

export interface DocsSearchProps {
  items: readonly PublicSearchItem[];
  onSelect: (href: string) => void;
  placeholder?: string;
}

function getShortcutLabel(): string {
  if (typeof navigator === 'undefined') {
    return '⌘K';
  }

  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform) ? '⌘K' : 'Ctrl+K';
}

function useDocsDesktopViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.matchMedia('(min-width: 1024px)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}

function groupSearchItems(items: readonly PublicSearchItem[]) {
  const groups = new Map<string, PublicSearchItem[]>();

  for (const item of items) {
    const existing = groups.get(item.group) ?? [];
    existing.push(item);
    groups.set(item.group, existing);
  }

  return Array.from(groups.entries());
}

export function DocsSearch({
  items,
  onSelect,
  placeholder = DOCS_COMMAND_BAR_LABEL,
}: DocsSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isDesktopViewport = useDocsDesktopViewport();
  const shortcutLabel = getShortcutLabel();

  useEffect(() => {
    if (!isDesktopViewport) {
      setOpen(false);
      setQuery('');
    }
  }, [isDesktopViewport]);

  useEffect(() => {
    if (!isDesktopViewport) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSearchShortcutEvent(event)) {
        return;
      }

      event.preventDefault();
      setOpen((current) => !current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesktopViewport]);

  const filteredItems = useMemo(
    () => filterSearchResults(query, items),
    [items, query],
  );

  const groupedItems = useMemo(
    () => groupSearchItems(filteredItems),
    [filteredItems],
  );

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery('');
    onSelect(href);
  };

  return (
    <>
      <button
        type="button"
        className={`${TEXT_BODY_SM_CLASS} docs-search-field docs-search-trigger`}
        onClick={() => setOpen(true)}
        aria-label={`Open ${DOCS_COMMAND_BAR_LABEL}`}
      >
        <Search className="docs-search-field__icon" size={16} aria-hidden />
        <span className="docs-search-field__label">{placeholder}</span>
        <kbd className="docs-search-field__kbd" aria-hidden>
          {shortcutLabel}
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={(nextOpen: boolean) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setQuery('');
          }
        }}
        title={DOCS_COMMAND_BAR_LABEL}
        description="Search pages and articles across the site"
        className="docs-search-dialog"
      >
        <Command shouldFilter={false}>
          <div
            data-slot="command-input-wrapper"
            className="docs-search-dialog__input-wrapper"
          >
            <DocsSearchField>
              <Search className="docs-search-field__icon" size={16} aria-hidden />
              <CommandPrimitive.Input
                data-slot="command-input"
                className="docs-search-field__control"
                placeholder={placeholder}
                value={query}
                onValueChange={setQuery}
                aria-label={DOCS_COMMAND_BAR_LABEL}
              />
              <kbd className="docs-search-field__kbd" aria-hidden>
                {shortcutLabel}
              </kbd>
            </DocsSearchField>
          </div>
          <CommandList className="docs-search-dialog__list">
            <CommandEmpty className="docs-search-dialog__empty">
              No results found.
            </CommandEmpty>
            {groupedItems.map(([group, groupItems], index) => (
              <div key={group}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={group} className="docs-search-dialog__group">
                  {groupItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      className={`${TEXT_BODY_SM_CLASS} docs-search-dialog__item`}
                      value={`${item.title} ${item.excerpt ?? ''} ${item.group}`}
                      onSelect={() => handleSelect(item.href)}
                    >
                      <span className="docs-search-dialog__item-body">
                        <span className="docs-search-dialog__item-title">
                          {item.title}
                        </span>
                        {item.excerpt ? (
                          <span className="docs-search-dialog__item-description">
                            {item.excerpt}
                          </span>
                        ) : null}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
