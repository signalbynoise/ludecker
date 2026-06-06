import { DocsContent } from "@ludecker/ui";
import { headers } from "next/headers";
import { DocsLayoutClient } from "@/components/DocsLayoutClient";
import { fetchPageContext } from "@/lib/content/fetch-page-context";
import { fetchGettingStartedEntries } from "@/lib/content/queries";
import { IntroAnimationProvider } from "@/lib/intro-animation/IntroAnimationContext";
import { mapDocsNavEntries } from "@/lib/nav/map-docs-nav-entries";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const [{ hero, toc }, gettingStartedItems] = await Promise.all([
    fetchPageContext(pathname),
    fetchGettingStartedEntries(),
  ]);
  const gettingStartedEntries = mapDocsNavEntries(gettingStartedItems);

  return (
    <IntroAnimationProvider>
      <DocsLayoutClient
        heroTitle={hero.title}
        heroDescription={hero.description}
        tocItems={toc}
        gettingStartedEntries={gettingStartedEntries}
      >
        <DocsContent>{children}</DocsContent>
      </DocsLayoutClient>
    </IntroAnimationProvider>
  );
}
