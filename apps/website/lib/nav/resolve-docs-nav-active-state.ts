import { DOCS_NAV_GETTING_STARTED, DOCS_NAV_SECTIONS } from '@ludecker/ui';
import { resolveActiveNavId } from '@/lib/nav/resolve-active-nav-id';
import { pathnameMatchesHref } from '@/lib/nav/pathname-matches-href';
import { normalizePathname } from '@/lib/routing/pathname';

export interface DocsNavActiveState {
  homeActive: boolean;
  activeGettingStartedHref: string | undefined;
  activeNavId: string | undefined;
  activeSection: string | undefined;
}

function sectionTitleForActiveId(activeId?: string): string | undefined {
  if (!activeId) {
    return undefined;
  }

  return DOCS_NAV_SECTIONS.find((section) => section.itemIds.includes(activeId))?.title;
}

/**
 * Resolves a single active docs nav target for the current pathname.
 * Getting Started entries win over section NAV_ITEMS when both map to the same URL.
 */
export function resolveDocsNavActiveState(
  pathname: string,
  gettingStartedHrefs: readonly string[],
): DocsNavActiveState {
  const normalized = normalizePathname(pathname);
  const homeActive = normalized === '/';

  const activeGettingStartedHref = gettingStartedHrefs.find((href) =>
    pathnameMatchesHref(normalized, href),
  );

  if (activeGettingStartedHref) {
    return {
      homeActive,
      activeGettingStartedHref,
      activeNavId: undefined,
      activeSection: DOCS_NAV_GETTING_STARTED,
    };
  }

  if (homeActive) {
    return {
      homeActive,
      activeGettingStartedHref: undefined,
      activeNavId: undefined,
      activeSection: DOCS_NAV_GETTING_STARTED,
    };
  }

  const activeNavId = resolveActiveNavId(normalized);

  return {
    homeActive,
    activeGettingStartedHref: undefined,
    activeNavId,
    activeSection: sectionTitleForActiveId(activeNavId),
  };
}
