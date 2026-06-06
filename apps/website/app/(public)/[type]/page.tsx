import { AnimatedArticleList } from "@/components/AnimatedArticleList";
import { DocsPageShell } from "@/components/DocsPageShell";
import { ARTICLE_TYPES, NAV_ITEMS } from "@ludecker/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  listRouteSegments,
  resolveArticleTypeFromRouteSegment,
} from "@/lib/content/article-types";
import { getSectionEntries } from "@/lib/content/cached-queries";
import { FALLBACK_ARTICLES } from "@/lib/content/fallback";
import { buildSectionPathname } from "@/lib/routing/pathname";

export const revalidate = 3600;

interface TypeListPageProps {
  params: Promise<{ type: string }>;
}

function resolveNavItem(type: string) {
  return NAV_ITEMS.find(
    (item) => item.id === type || item.href === `/${type}`,
  );
}

export async function generateMetadata({
  params,
}: TypeListPageProps): Promise<Metadata> {
  const { type } = await params;
  const articleType = resolveArticleTypeFromRouteSegment(type);

  if (!articleType || articleType === "home") {
    return { title: "Not found" };
  }

  const label =
    ARTICLE_TYPES.find((option) => option.value === articleType)?.label ??
    articleType;
  return { title: label, description: `All ${label}` };
}

export default async function TypeListPage({ params }: TypeListPageProps) {
  const { type } = await params;
  const articleType = resolveArticleTypeFromRouteSegment(type);

  if (!articleType || articleType === "home") {
    notFound();
  }

  if (!resolveNavItem(type)) {
    notFound();
  }

  const items = await getSectionEntries(articleType);
  const rows =
    items.length > 0
      ? items
      : FALLBACK_ARTICLES.filter((entry) => entry.article_type === articleType);

  return (
    <DocsPageShell pathname={buildSectionPathname(type)}>
      <AnimatedArticleList
        items={rows.map((content, index) => ({
          content,
          index: index + 1,
        }))}
      />
    </DocsPageShell>
  );
}

export function generateStaticParams() {
  return listRouteSegments().map((type) => ({ type }));
}
