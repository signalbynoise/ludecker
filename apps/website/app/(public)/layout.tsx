import { BrandLogo, Footer, PageShell, SiteLayout } from "@ludecker/ui";
import Link from "next/link";
import { SiteNavActive } from "./SiteNavActive";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageShell>
      <SiteLayout
        sidebar={
          <>
            <Link href="/">
              <BrandLogo />
            </Link>
            <SiteNavActive />
            <Footer />
          </>
        }
      >
        {children}
      </SiteLayout>
    </PageShell>
  );
}
