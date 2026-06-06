/** Canonical pathname helpers — route SSOT for public docs pages. */

export const HOME_PATHNAME = '/';

export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/$/, '') || HOME_PATHNAME;
}

export function buildSectionPathname(typeSegment: string): string {
  return normalizePathname(`/${typeSegment}`);
}

export function buildContentPathname(typeSegment: string, slug: string): string {
  return normalizePathname(`/${typeSegment}/${slug}`);
}
