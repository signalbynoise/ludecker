import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DOCS_NAV_OVERRIDES_COOKIE } from './docs-nav-persistence';
import { getOrCreateDocsNavStore, resetDocsNavStoreForTests } from './docs-nav-store';

function clearPersistedNavState(): void {
  document.cookie = `${DOCS_NAV_OVERRIDES_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  resetDocsNavStoreForTests();
}

describe('getOrCreateDocsNavStore', () => {
  beforeEach(() => {
    clearPersistedNavState();
  });

  afterEach(() => {
    clearPersistedNavState();
  });

  it('bootstraps the first active section on cold load', () => {
    const store = getOrCreateDocsNavStore({});

    store.bootstrapColdLoad('Content', { pathname: '/articles' });

    expect(store.getDisplaySnapshot()).toEqual({
      'Getting Started': true,
      Content: true,
      Resources: false,
      Visual: false,
    });
  });

  it('keeps user-opened sections open across active-section changes', () => {
    const store = getOrCreateDocsNavStore({});

    store.bootstrapColdLoad('Content');
    store.toggleSection('Resources');

    expect(store.getDisplaySnapshot().Resources).toBe(true);

    store.bootstrapColdLoad('Resources', { pathname: '/tools' });

    const display = store.getDisplaySnapshot();
    expect(display.Content).toBe(true);
    expect(display.Resources).toBe(true);
  });

  it('opens the destination section on route change without closing pinned sections', () => {
    const store = getOrCreateDocsNavStore({});

    store.bootstrapColdLoad('Getting Started', { pathname: '/' });
    store.openActiveSectionForRoute('Content', { pathname: '/articles' });

    const display = store.getDisplaySnapshot();
    expect(display['Getting Started']).toBe(true);
    expect(display.Content).toBe(true);
    expect(display.Resources).toBe(false);
  });

  it('initializes from server overrides passed at store creation', () => {
    const store = getOrCreateDocsNavStore({
      Content: true,
      Resources: true,
    });

    expect(store.getDisplaySnapshot()).toEqual({
      'Getting Started': true,
      Content: true,
      Resources: true,
      Visual: false,
    });
  });

  it('exposes updated section state via getSnapshot', () => {
    const store = getOrCreateDocsNavStore({});

    store.bootstrapColdLoad('Content');

    expect(store.getSnapshot()).toEqual({ Content: true });
    expect(store.getDisplaySnapshot().Content).toBe(true);
  });

  it('restores section state from the document cookie after static SSR', () => {
    document.cookie = `${DOCS_NAV_OVERRIDES_COOKIE}=${encodeURIComponent(
      JSON.stringify({
        'Getting Started': true,
        Content: true,
        Resources: true,
        Visual: false,
      }),
    )}; path=/; SameSite=Lax`;

    const store = getOrCreateDocsNavStore({});
    store.hydrateFromDocumentCookie();

    expect(store.getDisplaySnapshot()).toEqual({
      'Getting Started': true,
      Content: true,
      Resources: true,
      Visual: false,
    });
  });

  it('closes a section only when the user toggles it', () => {
    const store = getOrCreateDocsNavStore({});

    store.bootstrapColdLoad('Content');
    store.toggleSection('Resources');
    store.toggleSection('Resources');

    expect(store.getDisplaySnapshot().Resources).toBe(false);
    expect(store.getDisplaySnapshot().Content).toBe(true);
  });
});
