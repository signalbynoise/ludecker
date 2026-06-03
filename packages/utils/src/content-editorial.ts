/** Matches editorial labels: C:, P1:, R:, FS:, etc. */
export const EDITORIAL_LINE_PATTERN = /^([A-Z]+\d*:|FS:|R:)\s*(.*)$/;

export type ContentSectionVariant = 'chapter' | 'paragraph' | 'sources' | 'citation' | 'default';

export interface EditorialLineParts {
  prefix: string;
  body: string;
}

export function splitEditorialLine(line: string): EditorialLineParts | null {
  const trimmed = line.trim();
  const match = trimmed.match(EDITORIAL_LINE_PATTERN);
  if (!match?.[1]) {
    return null;
  }

  return {
    prefix: match[1],
    body: match[2] ?? '',
  };
}

export function isEditorialHeadingLine(line: string): boolean {
  return EDITORIAL_LINE_PATTERN.test(line.trim());
}

export function resolveContentSectionVariant(prefix: string): ContentSectionVariant {
  if (prefix === 'C:') {
    return 'chapter';
  }
  if (prefix === 'R:') {
    return 'sources';
  }

  const paragraphMatch = prefix.match(/^P(\d+):$/);
  if (paragraphMatch) {
    const index = Number(paragraphMatch[1]);
    if (index >= 6) {
      return 'citation';
    }
    return 'paragraph';
  }

  return 'default';
}
