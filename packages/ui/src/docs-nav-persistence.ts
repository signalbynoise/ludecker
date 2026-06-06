import {
  areSectionStatesEqual,
  serializeSectionStateForCookie,
  type DocsNavSectionOverrides,
} from './docs-nav-state';

export const DOCS_NAV_OVERRIDES_COOKIE = 'docs_nav_overrides';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function parseSectionsPayload(raw: string): DocsNavSectionOverrides | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).map(([title, open]) => [
        title,
        Boolean(open),
      ]),
    );
  } catch {
    return null;
  }
}

export function readDocumentCookieSections(): DocsNavSectionOverrides | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${DOCS_NAV_OVERRIDES_COOKIE}=`;
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(prefix));

  if (!match) {
    return null;
  }

  return parseSectionsPayload(decodeURIComponent(match.slice(prefix.length)));
}

export function writeSectionsCookie(sections: DocsNavSectionOverrides): void {
  if (typeof document === 'undefined') {
    return;
  }

  const payload = serializeSectionStateForCookie(sections);

  document.cookie = `${DOCS_NAV_OVERRIDES_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function sectionStatesDiffer(
  a: DocsNavSectionOverrides,
  b: DocsNavSectionOverrides,
): boolean {
  return !areSectionStatesEqual(a, b);
}
