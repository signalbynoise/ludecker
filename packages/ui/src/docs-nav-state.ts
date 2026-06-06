import {
  DOCS_NAV_ALL_SECTION_TITLES,
  DOCS_NAV_GETTING_STARTED,
  sectionTitleForActiveId,
} from './docs-nav-config';

export type DocsNavSectionOverrides = Record<string, boolean>;

export type DocsNavOpenSnapshot = Record<string, boolean>;

export type SectionOpenReason =
  | 'override-true'
  | 'override-false'
  | 'default-getting-started'
  | 'default-active-section'
  | 'closed-default';

export interface SectionOpenResolution {
  open: boolean;
  reason: SectionOpenReason;
}

/** Resolve open state for display and for route snapshots (includes active-section default). */
export function resolveSectionOpenState(
  title: string,
  overrides: DocsNavSectionOverrides,
  activeSection?: string,
): SectionOpenResolution {
  if (Object.prototype.hasOwnProperty.call(overrides, title)) {
    return {
      open: overrides[title],
      reason: overrides[title] ? 'override-true' : 'override-false',
    };
  }

  if (title === DOCS_NAV_GETTING_STARTED) {
    return { open: true, reason: 'default-getting-started' };
  }

  if (title === activeSection) {
    return { open: true, reason: 'default-active-section' };
  }

  return { open: false, reason: 'closed-default' };
}

export function resolveSectionOpen(
  title: string,
  overrides: DocsNavSectionOverrides,
  activeSection?: string,
): boolean {
  return resolveSectionOpenState(title, overrides, activeSection).open;
}

export function buildOpenSnapshot(
  overrides: DocsNavSectionOverrides,
  activeSection?: string,
): DocsNavOpenSnapshot {
  return Object.fromEntries(
    DOCS_NAV_ALL_SECTION_TITLES.map((title) => [
      title,
      resolveSectionOpen(title, overrides, activeSection),
    ]),
  );
}

export function findCollapsedSections(
  before: DocsNavOpenSnapshot,
  after: DocsNavOpenSnapshot,
): string[] {
  return DOCS_NAV_ALL_SECTION_TITLES.filter((title) => before[title] && !after[title]);
}

/** Persist every section open under the outgoing route context into overrides. */
export function persistOpenSections(
  current: DocsNavSectionOverrides,
  activeSectionWhen: string | undefined,
): DocsNavSectionOverrides {
  let next = current;
  let changed = false;

  for (const title of DOCS_NAV_ALL_SECTION_TITLES) {
    if (Object.prototype.hasOwnProperty.call(next, title) && next[title] === false) {
      continue;
    }

    const { open } = resolveSectionOpenState(title, next, activeSectionWhen);
    if (!open) {
      continue;
    }

    if (next[title] === true) {
      continue;
    }

    if (!changed) {
      next = { ...current };
      changed = true;
    }

    next[title] = true;
  }

  return next;
}

export function applyRouteSectionOverrides(
  current: DocsNavSectionOverrides,
  previousActiveSection: string | undefined,
  nextActiveSection: string | undefined,
): DocsNavSectionOverrides {
  const outgoingActive = previousActiveSection ?? nextActiveSection;
  let next = persistOpenSections(current, outgoingActive);

  if (nextActiveSection && next[nextActiveSection] !== true) {
    next = next === current ? { ...current } : { ...next };
    next[nextActiveSection] = true;
  }

  return next;
}

export function pathnameMatchesNavEntry(pathname: string, href: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const normalizedHref = href.replace(/\/$/, '') || '/';

  return normalized === normalizedHref || normalized.startsWith(`${normalizedHref}/`);
}

export function resolveActiveSectionTitle(
  activeId: string | undefined,
  options: {
    homeActive: boolean;
    pathname: string;
    gettingStartedHrefs: readonly string[];
  },
): string | undefined {
  if (options.homeActive) {
    return DOCS_NAV_GETTING_STARTED;
  }

  if (
    options.gettingStartedHrefs.some((href) =>
      pathnameMatchesNavEntry(options.pathname, href),
    )
  ) {
    return DOCS_NAV_GETTING_STARTED;
  }

  return sectionTitleForActiveId(activeId);
}

export function areOverridesEqual(
  a: DocsNavSectionOverrides,
  b: DocsNavSectionOverrides,
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (Boolean(a[key]) !== Boolean(b[key])) {
      return false;
    }
  }
  return true;
}
