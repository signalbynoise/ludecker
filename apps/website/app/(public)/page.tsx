import { ArticleBody } from "@ludecker/ui";
import type { Metadata } from "next";
import { HomeIntroReveal } from "@/components/HomeIntroReveal";
import { FALLBACK_HOME } from "@/lib/content/fallback";
import { fetchHomePageContent } from "@/lib/content/queries";
import { SITE_CONFIG } from "@/lib/constants";

/** Always read fresh intro from Supabase; publish actions revalidate this route. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const home = await fetchHomePageContent();
  const hero = home ?? FALLBACK_HOME;

  return (
    <HomeIntroReveal>
      <ArticleBody content={hero.content} articleType={hero.article_type} />
    </HomeIntroReveal>
  );
}
