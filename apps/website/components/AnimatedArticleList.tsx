"use client";

import { ArticleList, type ArticleListProps } from "@ludecker/ui";
import AnimatedContent from "@/components/react-bits/AnimatedContent/AnimatedContent";

export function AnimatedArticleList(props: ArticleListProps) {
  return (
    <AnimatedContent
      distance={48}
      duration={0.7}
      threshold={0.05}
      className="animated-article-list"
    >
      <ArticleList {...props} />
    </AnimatedContent>
  );
}
