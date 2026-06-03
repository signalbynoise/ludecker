import { ArticleList } from "@ludecker/ui";
import { ARTICLE_TYPES } from "@ludecker/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isListableArticleType,
  LISTABLE_ARTICLE_TYPES,
} from "@/lib/content/article-types";
import { FALLBACK_ARTICLES } from "@/lib/content/fallback";
import { fetchContentByType } from "@/lib/content/queries";
export const revalidate = 3600;

interface TypeListPageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({
  params,
}: TypeListPageProps): Promise<Metadata> {
  const { type } = await params;
  if (!isListableArticleType(type)) return { title: "Not found" };

  const label =
    ARTICLE_TYPES.find((option) => option.value === type)?.label ?? type;
  return { title: label, description: `All ${type}` };
}

export default async function TypeListPage({ params }: TypeListPageProps) {
  const { type } = await params;
  if (!isListableArticleType(type)) notFound();

  const items = await fetchContentByType(type);
  const rows =
    items.length > 0
      ? items
      : FALLBACK_ARTICLES.filter((a) => a.article_type === type);

  return (
    <ArticleList
      items={rows.map((content, index) => ({
        content,
        index: index + 1,
      }))}
    />
  );
}

export function generateStaticParams() {
  return LISTABLE_ARTICLE_TYPES.map((type) => ({ type }));
}
