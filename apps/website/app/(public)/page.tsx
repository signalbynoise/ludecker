import { ArticleBody } from "@ludecker/ui";
import type { Metadata } from "next";
import { DocsPageShell } from "@/components/DocsPageShell";
import { HomeIntroReveal } from "@/components/HomeIntroReveal";
import { FALLBACK_HOME } from "@/lib/content/fallback";
import { getHomePageContent } from "@/lib/content/cached-queries";
import { SITE_CONFIG } from "@/lib/constants";
import { HOME_PATHNAME } from "@/lib/routing/pathname";

/** Always read fresh intro from Supabase; publish actions revalidate this route. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const home = await getHomePageContent();
  const hero = home ?? FALLBACK_HOME;

  return (
    <DocsPageShell pathname={HOME_PATHNAME}>
      <HomeIntroReveal>
        <ArticleBody content={hero.content} articleType={hero.article_type} />
      </HomeIntroReveal>
    </DocsPageShell>
  );
}
