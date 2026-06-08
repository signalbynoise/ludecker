/** Path segments served by explicit GET handlers on /api/public (not article types). */
export const PUBLIC_STATIC_ROUTE_SEGMENTS = [
  "npm-downloads",
  "search-index",
  "getting-started",
  "page-context",
  "slugs",
] as const;

export type PublicStaticRouteSegment =
  (typeof PUBLIC_STATIC_ROUTE_SEGMENTS)[number];

export function isPublicStaticRouteSegment(
  segment: string,
): segment is PublicStaticRouteSegment {
  return (PUBLIC_STATIC_ROUTE_SEGMENTS as readonly string[]).includes(segment);
}
