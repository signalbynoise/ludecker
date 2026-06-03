export type ContentLinkSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; label: string; href: string };

const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function isSafeHttpUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Split paragraph text into plain text and outbound link segments.
 * Supports markdown `[label](https://…)` (preferred in CMS body).
 */
export function parseContentLinkSegments(text: string): ContentLinkSegment[] {
  const segments: ContentLinkSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const label = match[1] ?? '';
    const href = match[2] ?? '';

    if (!isSafeHttpUrl(href)) {
      continue;
    }

    if (matchIndex > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, matchIndex),
      });
    }

    segments.push({ type: 'link', label, href });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  if (segments.length === 0 && text.length > 0) {
    segments.push({ type: 'text', value: text });
  }

  return segments;
}

/** Returns true when body contains at least one markdown outbound link. */
export function contentHasOutboundLinks(text: string): boolean {
  MARKDOWN_LINK_PATTERN.lastIndex = 0;
  const match = MARKDOWN_LINK_PATTERN.exec(text);
  if (!match?.[2]) {
    return false;
  }
  return isSafeHttpUrl(match[2]);
}

/** Count distinct http(s) URLs in markdown link syntax. */
export function countOutboundLinks(text: string): number {
  const urls = new Set<string>();
  MARKDOWN_LINK_PATTERN.lastIndex = 0;

  for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
    const href = match[2];
    if (href && isSafeHttpUrl(href)) {
      urls.add(href);
    }
  }

  return urls.size;
}
