import { ArticleList } from "@ludecker/ui";
import type { Metadata } from "next";
import { FALLBACK_ARTICLES } from "@/lib/content/fallback";
import { fetchContentByType } from "@/lib/content/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Articles",
  description: "All articles",
};

export default async function ArticlesPage() {
  const items = await fetchContentByType("article");
  const articles =
    items.length > 0
      ? items
      : FALLBACK_ARTICLES.filter((a) => a.article_type === "article");

  return (
    <ArticleList
      baseHref="/article"
      items={articles.map((content, index) => ({
        content,
        index: index + 1,
      }))}
    />
  );
}
