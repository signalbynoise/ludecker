import {
  DOCS_NAV_ALL_SECTION_TITLES,
  DOCS_NAV_GETTING_STARTED,
} from './docs-nav-config';

/** Persisted + in-memory section open map. Keys present = explicit user/bootstrap choice. */
export type DocsNavSectionOverrides = Record<string, boolean>;

export type DocsNavOpenSnapshot = Record<string, boolean>;

export function resolveSectionOpen(
  title: string,
  sections: DocsNavSectionOverrides,
): boolean {
  if (Object.prototype.hasOwnProperty.call(sections, title)) {
    return sections[title];
  }

  return title === DOCS_NAV_GETTING_STARTED;
}

export function buildSectionOpenSnapshot(
  sections: DocsNavSectionOverrides,
): DocsNavOpenSnapshot {
  return Object.fromEntries(
    DOCS_NAV_ALL_SECTION_TITLES.map((title) => [title, resolveSectionOpen(title, sections)]),
  );
}

export function toggleSectionState(
  sections: DocsNavSectionOverrides,
  title: string,
): DocsNavSectionOverrides {
  return {
    ...sections,
    [title]: !resolveSectionOpen(title, sections),
  };
}

/** On route change: open the active section without closing others. */
export function openActiveSectionForRoute(
  sections: DocsNavSectionOverrides,
  activeSection: string | undefined,
): { sections: DocsNavSectionOverrides; changed: boolean } {
  if (!activeSection) {
    return { sections, changed: false };
  }

  if (Object.prototype.hasOwnProperty.call(sections, activeSection) && sections[activeSection] === false) {
    return { sections, changed: false };
  }

  if (resolveSectionOpen(activeSection, sections)) {
    return { sections, changed: false };
  }

  return {
    sections: { ...sections, [activeSection]: true },
    changed: true,
  };
}

export function bootstrapActiveSectionOnce(
  sections: DocsNavSectionOverrides,
  activeSection: string | undefined,
  hasBootstrapped: boolean,
): { sections: DocsNavSectionOverrides; hasBootstrapped: boolean; changed: boolean } {
  if (hasBootstrapped || !activeSection) {
    return { sections, hasBootstrapped, changed: false };
  }

  if (Object.prototype.hasOwnProperty.call(sections, activeSection)) {
    return { sections, hasBootstrapped: true, changed: false };
  }

  return {
    sections: { ...sections, [activeSection]: true },
    hasBootstrapped: true,
    changed: true,
  };
}

export function areSectionStatesEqual(
  a: DocsNavSectionOverrides,
  b: DocsNavSectionOverrides,
): boolean {
  return DOCS_NAV_ALL_SECTION_TITLES.every(
    (title) => resolveSectionOpen(title, a) === resolveSectionOpen(title, b),
  );
}

export function serializeSectionStateForCookie(
  sections: DocsNavSectionOverrides,
): DocsNavSectionOverrides {
  return Object.fromEntries(
    DOCS_NAV_ALL_SECTION_TITLES.map((title) => [title, resolveSectionOpen(title, sections)]),
  );
}
