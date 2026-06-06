import { describe, expect, it } from 'vitest';
import { resolveDocsNavActiveState } from './resolve-docs-nav-active-state';

describe('resolveDocsNavActiveState', () => {
  const gettingStartedHrefs = [
    '/guide/quick-start-npx-ludecker-aaac-latest-init',
    '/articles/welcome',
  ];

  it('activates only the matching Getting Started entry for a tagged guide', () => {
    const pathname = '/guide/quick-start-npx-ludecker-aaac-latest-init';

    expect(resolveDocsNavActiveState(pathname, gettingStartedHrefs)).toEqual({
      homeActive: false,
      activeGettingStartedHref: '/guide/quick-start-npx-ludecker-aaac-latest-init',
      activeNavId: undefined,
      activeSection: 'Getting Started',
    });
  });

  it('activates Introduction on home without a Getting Started match', () => {
    expect(resolveDocsNavActiveState('/', gettingStartedHrefs)).toEqual({
      homeActive: true,
      activeGettingStartedHref: undefined,
      activeNavId: undefined,
      activeSection: 'Getting Started',
    });
  });

  it('activates a section nav item when no Getting Started entry matches', () => {
    expect(resolveDocsNavActiveState('/commands', gettingStartedHrefs)).toEqual({
      homeActive: false,
      activeGettingStartedHref: undefined,
      activeNavId: 'commands',
      activeSection: 'Resources',
    });
  });

  it('activates section nav item for nested section entries', () => {
    expect(resolveDocsNavActiveState('/skills/my-skill', gettingStartedHrefs)).toEqual({
      homeActive: false,
      activeGettingStartedHref: undefined,
      activeNavId: 'skills',
      activeSection: 'Resources',
    });
  });
});
