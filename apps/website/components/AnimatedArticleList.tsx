"use client";

import { ArticleList, type ArticleListProps } from "@ludecker/ui";
import { RouterLink } from "@/components/RouterLink";

export function AnimatedArticleList(props: ArticleListProps) {
  return <ArticleList {...props} linkComponent={RouterLink} />;
}
