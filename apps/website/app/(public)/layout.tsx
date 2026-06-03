import { PageShell, SiteLayout } from "@ludecker/ui";
import { PublicSidebar } from "@/components/PublicSidebar";
import { IntroAnimationProvider } from "@/lib/intro-animation/IntroAnimationContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <IntroAnimationProvider>
      <PageShell>
        <SiteLayout sidebar={<PublicSidebar />}>{children}</SiteLayout>
      </PageShell>
    </IntroAnimationProvider>
  );
}
