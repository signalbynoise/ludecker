"use client";

import { ArticleBody, type ArticleBodyProps } from "@ludecker/ui";
import AnimatedContent from "@/components/react-bits/AnimatedContent/AnimatedContent";

export function AnimatedArticleBody(props: ArticleBodyProps) {
  return (
    <AnimatedContent
      distance={48}
      duration={0.7}
      threshold={0.05}
      className="animated-article-body"
    >
      <ArticleBody {...props} />
    </AnimatedContent>
  );
}
