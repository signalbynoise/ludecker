import { PublicDocsLayoutClient } from "@/components/PublicDocsLayoutClient";
import { getGettingStartedEntries } from "@/lib/content/cached-queries";
import { IntroAnimationProvider } from "@/lib/intro-animation/IntroAnimationContext";
import { mapDocsNavEntries } from "@/lib/nav/map-docs-nav-entries";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gettingStartedItems = await getGettingStartedEntries();

  return (
    <IntroAnimationProvider>
      <PublicDocsLayoutClient
        gettingStartedEntries={mapDocsNavEntries(gettingStartedItems)}
      >
        {children}
      </PublicDocsLayoutClient>
    </IntroAnimationProvider>
  );
}
