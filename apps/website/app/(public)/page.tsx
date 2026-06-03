import { ArticleBody, ArticleList } from "@ludecker/ui";
import type { Metadata } from "next";
import { formatDate } from "@ludecker/utils";
import { FALLBACK_ARTICLES, FALLBACK_HOME } from "@/lib/content/fallback";
import {
  fetchFeaturedHomeContent,
  fetchPublishedContent,
} from "@/lib/content/queries";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const [home, allPublished] = await Promise.all([
    fetchFeaturedHomeContent(),
    fetchPublishedContent(),
  ]);

  const hero = home ?? FALLBACK_HOME;
  const recent =
    allPublished.length > 0
      ? allPublished.filter((item) => item.article_type !== "page").slice(0, 5)
      : FALLBACK_ARTICLES;

  const predicateLine = [
    "Predicate form:",
    `Type · ${hero.article_type}`,
    hero.published_at ? formatDate(hero.published_at) : null,
    hero.tags.length > 0
      ? `Tags · ${hero.tags.map((t) => t.name).join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const homeBody = [
    `C: ${hero.title}`,
    "",
    hero.excerpt ? `P1: ${hero.excerpt}` : "",
    "",
    predicateLine,
    "",
    hero.content,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return (
    <>
      <ArticleBody content={homeBody} />
      <ArticleList
        items={recent.map((item, index) => ({
          content: item,
          index: index + 1,
        }))}
      />
    </>
  );
}
