import { ArticleList } from "@ludecker/ui";
import {
  ARTICLE_TYPES,
  NAV_ITEMS,
  NAV_SECTION_IDS,
} from "@ludecker/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isListableArticleType,
  LISTABLE_ARTICLE_TYPES,
} from "@/lib/content/article-types";
import { FALLBACK_ARTICLES } from "@/lib/content/fallback";
import { fetchContentByTag, fetchContentByType } from "@/lib/content/queries";

export const revalidate = 3600;

interface TypeListPageProps {
  params: Promise<{ type: string }>;
}

function resolveNavItem(type: string) {
  return NAV_ITEMS.find((item) => item.id === type || item.href === `/${type}`);
}

export async function generateMetadata({
  params,
}: TypeListPageProps): Promise<Metadata> {
  const { type } = await params;
  const navItem = resolveNavItem(type);

  if (navItem?.tagSlug) {
    return { title: navItem.label, description: `All ${navItem.label}` };
  }

  if (!isListableArticleType(type)) return { title: "Not found" };

  const label =
    ARTICLE_TYPES.find((option) => option.value === type)?.label ?? type;
  return { title: label, description: `All ${type}` };
}

export default async function TypeListPage({ params }: TypeListPageProps) {
  const { type } = await params;
  const navItem = resolveNavItem(type);

  if (navItem?.tagSlug) {
    const items = await fetchContentByTag(navItem.tagSlug);
    return (
      <ArticleList
        items={items.map((content, index) => ({
          content,
          index: index + 1,
        }))}
      />
    );
  }

  if (!isListableArticleType(type)) notFound();

  const items = await fetchContentByType(type);
  const rows =
    items.length > 0
      ? items
      : FALLBACK_ARTICLES.filter((a) => a.article_type === type);

  return (
    <ArticleList
      baseHref={`/${type}`}
      items={rows.map((content, index) => ({
        content,
        index: index + 1,
      }))}
    />
  );
}

export function generateStaticParams() {
  return [
    ...LISTABLE_ARTICLE_TYPES.map((type) => ({ type })),
    ...NAV_SECTION_IDS.map((type) => ({ type })),
  ];
}
