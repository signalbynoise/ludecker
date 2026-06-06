import { createLogger } from '@ludecker/utils';
import { areOverridesEqual } from './docs-nav-state';
import type { DocsNavSectionOverrides } from './docs-nav-state';

export const DOCS_NAV_OVERRIDES_COOKIE = 'docs_nav_overrides';

const logger = createLogger('docs-nav-store', 'debug');

const EMPTY_OVERRIDES: DocsNavSectionOverrides = Object.freeze({});
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type Listener = () => void;

function writeOverridesCookie(overrides: DocsNavSectionOverrides): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (Object.keys(overrides).length === 0) {
    document.cookie = `${DOCS_NAV_OVERRIDES_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${DOCS_NAV_OVERRIDES_COOKIE}=${encodeURIComponent(JSON.stringify(overrides))}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export interface DocsNavStore {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => DocsNavSectionOverrides;
  getServerSnapshot: () => DocsNavSectionOverrides;
  getLastActiveSection: () => string | undefined;
  update: (
    updater: (current: DocsNavSectionOverrides) => DocsNavSectionOverrides,
    operation: string,
    context?: Record<string, unknown>,
  ) => DocsNavSectionOverrides;
  setLastActiveSection: (section: string | undefined) => void;
}

export function createDocsNavStore(initialOverrides: DocsNavSectionOverrides = EMPTY_OVERRIDES): DocsNavStore {
  let overrides =
    Object.keys(initialOverrides).length > 0 ? { ...initialOverrides } : EMPTY_OVERRIDES;
  let lastActiveSection: string | undefined;
  const listeners = new Set<Listener>();

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return overrides;
    },
    getServerSnapshot() {
      return overrides;
    },
    getLastActiveSection() {
      return lastActiveSection;
    },
    setLastActiveSection(section: string | undefined) {
      logger.debug('set-last-active-section', 'updated', { from: lastActiveSection, to: section });
      lastActiveSection = section;
    },
    update(updater, operation, context) {
      const before = overrides;
      const next = updater(overrides);

      logger.debug(operation, 'update-evaluated', {
        ...context,
        before,
        next,
        changed: !areOverridesEqual(before, next),
      });

      if (areOverridesEqual(before, next)) {
        logger.debug(operation, 'update-skipped', context);
        return overrides;
      }

      overrides = Object.keys(next).length > 0 ? { ...next } : EMPTY_OVERRIDES;
      writeOverridesCookie(overrides);
      listeners.forEach((listener) => listener());

      logger.info(operation, 'update-applied', {
        ...context,
        before,
        after: overrides,
      });

      return overrides;
    },
  };
}

export { EMPTY_OVERRIDES };
export type { DocsNavSectionOverrides } from './docs-nav-state';
