import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DOCS_NAV_OVERRIDES_COOKIE,
  readDocumentCookieSections,
  writeSectionsCookie,
} from './docs-nav-persistence';
import { resetDocsNavStoreForTests } from './docs-nav-store';

function clearPersistedNavState(): void {
  document.cookie = `${DOCS_NAV_OVERRIDES_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  resetDocsNavStoreForTests();
}

describe('docs-nav-persistence', () => {
  beforeEach(() => {
    clearPersistedNavState();
  });

  afterEach(() => {
    clearPersistedNavState();
  });

  it('writes and reads section state from the docs nav cookie', () => {
    writeSectionsCookie({
      Content: true,
      Resources: true,
    });

    expect(readDocumentCookieSections()).toEqual({
      'Getting Started': true,
      Content: true,
      Resources: true,
      Visual: false,
    });
  });
});
