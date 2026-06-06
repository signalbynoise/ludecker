import { ARTICLE_TYPES, NAV_ITEMS, type ArticleType } from "@ludecker/types";

function isArticleType(value: string): value is ArticleType {
  return ARTICLE_TYPES.some((option) => option.value === value);
}

export function resolveArticleTypeFromRouteSegment(
  segment: string,
): ArticleType | null {
  if (isArticleType(segment)) {
    return segment;
  }

  const navItem = NAV_ITEMS.find(
    (item) => item.id === segment || item.href.slice(1) === segment,
  );

  return navItem?.articleType ?? null;
}

export function isListableArticleType(value: string): value is ArticleType {
  const resolved = resolveArticleTypeFromRouteSegment(value);
  return resolved !== null && resolved !== "home";
}
