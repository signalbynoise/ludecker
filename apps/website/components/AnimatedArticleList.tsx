"use client";

import { ArticleList, type ArticleListProps } from "@ludecker/ui";
import Link from "next/link";

export function AnimatedArticleList(props: ArticleListProps) {
  return <ArticleList {...props} linkComponent={Link} />;
}
