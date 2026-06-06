import { createLogger } from '@ludecker/utils';
import { readDocumentCookieSections, writeSectionsCookie } from './docs-nav-persistence';
import {
  areSectionStatesEqual,
  bootstrapActiveSectionOnce,
  buildSectionOpenSnapshot,
  openActiveSectionForRoute,
  toggleSectionState,
  type DocsNavOpenSnapshot,
  type DocsNavSectionOverrides,
} from './docs-nav-state';

export { DOCS_NAV_OVERRIDES_COOKIE } from './docs-nav-persistence';

const logger = createLogger('docs-nav-store', 'debug');

const EMPTY_SECTIONS: DocsNavSectionOverrides = Object.freeze({});

type Listener = () => void;

let sharedStore: DocsNavStore | null = null;

function cloneSections(sections: DocsNavSectionOverrides): DocsNavSectionOverrides {
  return Object.keys(sections).length > 0 ? { ...sections } : EMPTY_SECTIONS;
}

function persistSections(sections: DocsNavSectionOverrides): void {
  writeSectionsCookie(sections);
}

export interface DocsNavStore {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => DocsNavSectionOverrides;
  getServerSnapshot: () => DocsNavSectionOverrides;
  getDisplaySnapshot: () => DocsNavOpenSnapshot;
  bootstrapColdLoad: (
    activeSection: string | undefined,
    context?: Record<string, unknown>,
  ) => void;
  openActiveSectionForRoute: (
    activeSection: string | undefined,
    context?: Record<string, unknown>,
  ) => void;
  toggleSection: (title: string) => void;
  hydrateFromDocumentCookie: () => void;
}

export interface CreateDocsNavStoreOptions {
  serverSnapshot?: DocsNavSectionOverrides;
}

export function createDocsNavStore(
  initialSections: DocsNavSectionOverrides = EMPTY_SECTIONS,
  options: CreateDocsNavStoreOptions = {},
): DocsNavStore {
  let sections = cloneSections(initialSections);
  const serverSnapshot = cloneSections(options.serverSnapshot ?? initialSections);
  let hasBootstrappedColdLoad = false;
  const listeners = new Set<Listener>();

  const publish = (
    nextSections: DocsNavSectionOverrides,
    operation: string,
    context?: Record<string, unknown>,
  ): void => {
    if (areSectionStatesEqual(sections, nextSections)) {
      logger.debug(operation, 'update-skipped', {
        ...context,
        sections,
        display: buildSectionOpenSnapshot(sections),
      });
      return;
    }

    const before = sections;
    const displayBefore = buildSectionOpenSnapshot(before);
    sections = cloneSections(nextSections);
    const displayAfter = buildSectionOpenSnapshot(sections);

    persistSections(sections);
    listeners.forEach((listener) => listener());

    logger.debug(operation, 'update-applied', {
      ...context,
      before,
      after: sections,
      displayBefore,
      displayAfter,
    });
  };

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return sections;
    },
    getServerSnapshot() {
      return serverSnapshot;
    },
    getDisplaySnapshot() {
      return buildSectionOpenSnapshot(sections);
    },
    bootstrapColdLoad(activeSection, context) {
      logger.debug('bootstrap-cold-load', 'start', {
        ...context,
        activeSection,
        hasBootstrappedColdLoad,
        sections,
        displayBefore: buildSectionOpenSnapshot(sections),
      });

      const result = bootstrapActiveSectionOnce(sections, activeSection, hasBootstrappedColdLoad);
      hasBootstrappedColdLoad = result.hasBootstrapped;

      if (!result.changed) {
        logger.debug('bootstrap-cold-load', 'skipped', {
          ...context,
          activeSection,
          hasBootstrappedColdLoad,
        });
        return;
      }

      publish(result.sections, 'bootstrap-cold-load', {
        ...context,
        activeSection,
      });
    },
    openActiveSectionForRoute(activeSection, context) {
      logger.debug('open-active-route', 'start', {
        ...context,
        activeSection,
        sections,
        displayBefore: buildSectionOpenSnapshot(sections),
      });

      const result = openActiveSectionForRoute(sections, activeSection);

      if (!result.changed) {
        logger.debug('open-active-route', 'skipped', {
          ...context,
          activeSection,
        });
        return;
      }

      publish(result.sections, 'open-active-route', {
        ...context,
        activeSection,
      });
    },
    toggleSection(title) {
      logger.debug('toggle', 'start', {
        title,
        currentlyOpen: buildSectionOpenSnapshot(sections)[title],
        sections,
      });

      publish(toggleSectionState(sections, title), 'toggle', { title });
    },
    hydrateFromDocumentCookie() {
      const cookieSections = readDocumentCookieSections();
      if (!cookieSections) {
        logger.debug('cookie-hydrate', 'skipped', { reason: 'no-cookie' });
        return;
      }

      logger.debug('cookie-hydrate', 'start', {
        cookieSections,
        sections,
        displayBefore: buildSectionOpenSnapshot(sections),
      });

      publish(cookieSections, 'cookie-hydrate');
    },
  };
}

export function getOrCreateDocsNavStore(
  serverInitial: DocsNavSectionOverrides = EMPTY_SECTIONS,
): DocsNavStore {
  if (typeof window === 'undefined') {
    return createDocsNavStore(serverInitial, { serverSnapshot: serverInitial });
  }

  if (!sharedStore) {
    sharedStore = createDocsNavStore(serverInitial, { serverSnapshot: serverInitial });
    // Before any child useLayoutEffect (bootstrap), restore cookie from static SSR pages.
    sharedStore.hydrateFromDocumentCookie();
    logger.debug('shared-store', 'created', {
      serverInitial,
      display: sharedStore.getDisplaySnapshot(),
    });
  }

  return sharedStore;
}

export function resetDocsNavStoreForTests(): void {
  sharedStore = null;
}

export { EMPTY_SECTIONS as EMPTY_OVERRIDES };
export type { DocsNavSectionOverrides } from './docs-nav-state';
