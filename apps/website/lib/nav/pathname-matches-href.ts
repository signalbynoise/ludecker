export function pathnameMatchesHref(pathname: string, href: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const normalizedHref = href.replace(/\/$/, '') || '/';

  return normalized === normalizedHref || normalized.startsWith(`${normalizedHref}/`);
}
