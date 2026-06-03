import { AnimatedArticleBody } from "@/components/AnimatedArticleBody";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isListableArticleType,
  resolveArticleTypeFromRouteSegment,
} from "@/lib/content/article-types";
import {
  fetchAllPublishedSlugs,
  fetchContentBySlug,
} from "@/lib/content/queries";
import { SITE_CONFIG } from "@/lib/constants";
import { getNavHref } from "@ludecker/utils";

export const revalidate = 3600;

interface ContentPageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllPublishedSlugs();
  return slugs.map(({ type, slug }) => ({
    type: getNavHref(type).slice(1),
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { type, slug } = await params;
  const articleType = resolveArticleTypeFromRouteSegment(type);
  if (!articleType || articleType === "home") {
    return { title: "Not found" };
  }

  const content = await fetchContentBySlug(articleType, slug);
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

  const articleType = resolveArticleTypeFromRouteSegment(type);
  if (!articleType || articleType === "home") notFound();

  const item = await fetchContentBySlug(articleType, slug);
  if (!item) notFound();

  return (
    <AnimatedArticleBody
      content={item.content}
      articleType={item.article_type}
    />
  );
}
