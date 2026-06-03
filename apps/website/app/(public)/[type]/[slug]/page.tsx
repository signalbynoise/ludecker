import { ArticleBody } from "@ludecker/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@ludecker/utils";
import { isListableArticleType } from "@/lib/content/article-types";
import {
  fetchAllPublishedSlugs,
  fetchContentBySlug,
} from "@/lib/content/queries";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

interface ContentPageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllPublishedSlugs();
  return slugs.map(({ type, slug }) => ({ type, slug }));
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { type, slug } = await params;
  if (!isListableArticleType(type)) return { title: "Not found" };

  const content = await fetchContentBySlug(type, slug);
  if (!content) return { title: "Not found" };

  return {
    title: content.seo_title ?? content.title,
    description:
      content.seo_description ?? content.excerpt ?? SITE_CONFIG.description,
    openGraph: {
      title: content.seo_title ?? content.title,
      description: content.seo_description ?? content.excerpt ?? undefined,
      images: content.cover_image ? [content.cover_image] : undefined,
    },
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { type, slug } = await params;
  if (!isListableArticleType(type)) notFound();

  const item = await fetchContentBySlug(type, slug);
  if (!item) notFound();

  const predicateLine = [
    "Predicate form:",
    `Type · ${item.article_type}`,
    item.published_at ? formatDate(item.published_at) : null,
    item.tags.length > 0
      ? `Tags · ${item.tags.map((t) => t.name).join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const body = [
    `C: ${item.title}`,
    "",
    item.excerpt ? `P1: ${item.excerpt}` : "",
    "",
    predicateLine,
    "",
    item.content,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return <ArticleBody content={body} />;
}
