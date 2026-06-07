"use client";

import { ArticleBody, type ArticleBodyProps } from "@ludecker/ui";
import { useIntroAnimation } from "@/lib/intro-animation/IntroAnimationContext";

export function HomeArticleBody(props: ArticleBodyProps) {
  const { phase } = useIntroAnimation();

  return (
    <ArticleBody {...props} diagramReady={phase !== "sidebar-typing"} />
  );
}
