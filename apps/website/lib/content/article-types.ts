import { ARTICLE_TYPES, type ArticleType } from "@ludecker/types";

export const LISTABLE_ARTICLE_TYPES: ArticleType[] = ARTICLE_TYPES.map(
  (option) => option.value,
).filter((type) => type !== "page");

export function isListableArticleType(value: string): value is ArticleType {
  return (LISTABLE_ARTICLE_TYPES as readonly string[]).includes(value);
}
