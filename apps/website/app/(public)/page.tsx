import { ArticleBody } from "@ludecker/ui";
import type { Metadata } from "next";
import { FALLBACK_HOME } from "@/lib/content/fallback";
import { fetchFeaturedHomeContent } from "@/lib/content/queries";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const home = await fetchFeaturedHomeContent();
  const hero = home ?? FALLBACK_HOME;

  return <ArticleBody content={hero.content} />;
}
