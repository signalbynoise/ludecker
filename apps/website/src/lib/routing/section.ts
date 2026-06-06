import { NAV_ITEMS, type ArticleType } from "@ludecker/types";
import {
  isListableArticleType,
  resolveArticleTypeFromRouteSegment,
} from "@/lib/content/article-types";

function resolveNavItem(typeSegment: string) {
  return NAV_ITEMS.find(
    (item) => item.id === typeSegment || item.href === `/${typeSegment}`,
  );
}

export function assertListableSection(typeSegment: string): ArticleType {
  if (!isListableArticleType(typeSegment)) {
    throw new Error("NOT_FOUND");
  }

  const articleType = resolveArticleTypeFromRouteSegment(typeSegment);
  if (!articleType || articleType === "home" || !resolveNavItem(typeSegment)) {
    throw new Error("NOT_FOUND");
  }

  return articleType;
}
