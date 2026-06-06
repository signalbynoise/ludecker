'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  resolveSectionOpen,
  type DocsNavSectionOverrides,
} from './docs-nav-state';
import {
  EMPTY_OVERRIDES,
  getOrCreateDocsNavStore,
} from './docs-nav-store';

export { DOCS_NAV_GETTING_STARTED } from './docs-nav-config';
export type { DocsNavSectionOverrides } from './docs-nav-state';
export { DOCS_NAV_OVERRIDES_COOKIE, getOrCreateDocsNavStore, resetDocsNavStoreForTests } from './docs-nav-store';

interface DocsNavContextValue {
  sections: DocsNavSectionOverrides;
  toggleSection: (title: string) => void;
  isSectionOpen: (title: string) => boolean;
  bootstrapColdLoad: (activeSection: string | undefined, context?: Record<string, unknown>) => void;
  openActiveSectionForRoute: (
    activeSection: string | undefined,
    context?: Record<string, unknown>,
  ) => void;
}

const DocsNavContext = createContext<DocsNavContextValue | null>(null);

export interface DocsNavProviderProps {
  children: ReactNode;
  initialOverrides?: DocsNavSectionOverrides;
}

export function DocsNavProvider({
  children,
  initialOverrides = EMPTY_OVERRIDES,
}: DocsNavProviderProps) {
  const store = useMemo(() => getOrCreateDocsNavStore(initialOverrides), []);

  const sections = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const isSectionOpen = useCallback(
    (title: string) => resolveSectionOpen(title, sections),
    [sections],
  );

  const toggleSection = useCallback((title: string) => store.toggleSection(title), [store]);

  const bootstrapColdLoad = useCallback(
    (activeSection: string | undefined, context?: Record<string, unknown>) => {
      store.bootstrapColdLoad(activeSection, context);
    },
    [store],
  );

  const openActiveSectionForRoute = useCallback(
    (activeSection: string | undefined, context?: Record<string, unknown>) => {
      store.openActiveSectionForRoute(activeSection, context);
    },
    [store],
  );

  const value = useMemo(
    () => ({
      sections,
      toggleSection,
      isSectionOpen,
      bootstrapColdLoad,
      openActiveSectionForRoute,
    }),
    [sections, toggleSection, isSectionOpen, bootstrapColdLoad, openActiveSectionForRoute],
  );

  return <DocsNavContext.Provider value={value}>{children}</DocsNavContext.Provider>;
}

export function useDocsNav(): DocsNavContextValue {
  const context = useContext(DocsNavContext);
  if (!context) {
    throw new Error('useDocsNav must be used within DocsNavProvider');
  }
  return context;
}
