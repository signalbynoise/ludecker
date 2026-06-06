'use client';

import { createLogger } from '@ludecker/utils';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  applyRouteSectionOverrides,
  buildOpenSnapshot,
  findCollapsedSections,
  persistOpenSections,
  resolveSectionOpen,
  resolveSectionOpenState,
  type DocsNavOpenSnapshot,
  type DocsNavSectionOverrides,
} from './docs-nav-state';
import {
  createDocsNavStore,
  EMPTY_OVERRIDES,
  type DocsNavStore,
} from './docs-nav-store';

export { DOCS_NAV_GETTING_STARTED } from './docs-nav-config';
export type { DocsNavSectionOverrides } from './docs-nav-state';
export {
  resolveSectionOpen,
  persistOpenSections,
  applyRouteSectionOverrides,
} from './docs-nav-state';
export { DOCS_NAV_OVERRIDES_COOKIE } from './docs-nav-store';

const logger = createLogger('docs-nav-provider', 'debug');

interface DocsNavContextValue {
  overrides: DocsNavSectionOverrides;
  toggleSection: (title: string, activeSection?: string) => void;
  isSectionOpen: (title: string, activeSection?: string) => boolean;
  persistCurrentSections: (activeSection?: string) => void;
  syncSectionsForRoute: (nextActiveSection: string | undefined) => void;
}

const DocsNavContext = createContext<DocsNavContextValue | null>(null);

function logPersistDecisions(
  operation: string,
  current: DocsNavSectionOverrides,
  activeSectionWhen: string | undefined,
): void {
  const decisions = Object.fromEntries(
    Object.entries(buildOpenSnapshot(current, activeSectionWhen)).map(([title, open]) => {
      const { reason } = resolveSectionOpenState(title, current, activeSectionWhen);
      const hasOverride = Object.prototype.hasOwnProperty.call(current, title);
      const willPin = open && (!hasOverride || current[title] !== false) && current[title] !== true;

      return [title, { open, reason, hasOverride, willPin }];
    }),
  );

  logger.debug(operation, 'persist-decisions', {
    activeSectionWhen,
    overrides: current,
    decisions,
  });
}

export interface DocsNavProviderProps {
  children: ReactNode;
  initialOverrides?: DocsNavSectionOverrides;
}

export function DocsNavProvider({
  children,
  initialOverrides = EMPTY_OVERRIDES,
}: DocsNavProviderProps) {
  const storeRef = useRef<DocsNavStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createDocsNavStore(initialOverrides);
    logger.info('init', 'store-created', { initialOverrides });
  }

  const store = storeRef.current;
  const overrides = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const isSectionOpen = useCallback(
    (title: string, activeSection?: string) => resolveSectionOpen(title, overrides, activeSection),
    [overrides],
  );

  const toggleSection = useCallback(
    (title: string, activeSection?: string) => {
      const before = resolveSectionOpenState(title, store.getSnapshot(), activeSection);

      logger.info('toggle', 'start', {
        title,
        activeSection,
        beforeOpen: before.open,
        beforeReason: before.reason,
        overrides: store.getSnapshot(),
      });

      store.update(
        (current) => {
          const nextOpen = !resolveSectionOpen(title, current, activeSection);
          return { ...current, [title]: nextOpen };
        },
        'toggle',
        { title, activeSection },
      );

      const after = resolveSectionOpenState(title, store.getSnapshot(), activeSection);
      logger.info('toggle', 'success', {
        title,
        activeSection,
        afterOpen: after.open,
        afterReason: after.reason,
        overrides: store.getSnapshot(),
      });
    },
    [store],
  );

  const persistCurrentSections = useCallback(
    (activeSection?: string) => {
      const current = store.getSnapshot();
      logPersistDecisions('persist-current', current, activeSection);

      store.update(
        (overrides) => persistOpenSections(overrides, activeSection),
        'persist-current',
        { activeSection, lastActiveSection: store.getLastActiveSection() },
      );
    },
    [store],
  );

  const syncSectionsForRoute = useCallback(
    (nextActiveSection: string | undefined) => {
      const previousActiveSection = store.getLastActiveSection();
      const overridesBefore = store.getSnapshot();
      const openBefore = buildOpenSnapshot(overridesBefore, previousActiveSection ?? nextActiveSection);

      if (previousActiveSection === nextActiveSection) {
        logger.debug('route-sync', 'skipped-same-section', {
          activeSection: nextActiveSection,
          overrides: overridesBefore,
          openBefore,
        });
        return;
      }

      logger.info('route-sync', 'start', {
        previousActiveSection,
        nextActiveSection,
        overridesBefore,
        openBefore,
      });

      if (previousActiveSection !== undefined) {
        logPersistDecisions('route-sync-persist-outgoing', overridesBefore, previousActiveSection);
        store.update(
          (current) => persistOpenSections(current, previousActiveSection),
          'route-sync-persist-outgoing',
          { previousActiveSection, nextActiveSection },
        );
      }

      const overridesMid = store.getSnapshot();
      store.update(
        (current) => applyRouteSectionOverrides(current, previousActiveSection, nextActiveSection),
        'route-sync-apply',
        { previousActiveSection, nextActiveSection },
      );

      const overridesAfter = store.getSnapshot();
      const openAfter = buildOpenSnapshot(overridesAfter, nextActiveSection);
      const collapsed = findCollapsedSections(openBefore, openAfter);

      if (collapsed.length > 0) {
        logger.warn('route-sync', 'auto-collapse-detected', {
          previousActiveSection,
          nextActiveSection,
          collapsed,
          openBefore,
          openAfter,
          overridesBefore,
          overridesMid,
          overridesAfter,
        });
      } else {
        logger.debug('route-sync', 'no-collapse', {
          previousActiveSection,
          nextActiveSection,
          openBefore,
          openAfter,
        });
      }

      store.setLastActiveSection(nextActiveSection);

      logger.info('route-sync', 'success', {
        previousActiveSection,
        nextActiveSection,
        overridesAfter,
        openAfter,
      });
    },
    [store],
  );

  const value = useMemo(
    () => ({
      overrides,
      toggleSection,
      isSectionOpen,
      persistCurrentSections,
      syncSectionsForRoute,
    }),
    [overrides, toggleSection, isSectionOpen, persistCurrentSections, syncSectionsForRoute],
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

export type { DocsNavOpenSnapshot };
