import type { DocsNavSectionOverrides } from '@ludecker/ui';

const EMPTY_OVERRIDES: DocsNavSectionOverrides = Object.freeze({});

export function parseDocsNavOverridesCookie(raw: string | undefined): DocsNavSectionOverrides {
  if (!raw) {
    return EMPTY_OVERRIDES;
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== 'object' || parsed === null) {
      return EMPTY_OVERRIDES;
    }

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).map(([title, open]) => [title, Boolean(open)]),
    );
  } catch {
    return EMPTY_OVERRIDES;
  }
}
