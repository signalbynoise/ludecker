import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TEXT_BODY_CLASS } from "@ludecker/ui";
import "@ludecker/ui/tokens.css";
import "@ludecker/ui/typography.css";
import "@ludecker/ui/docs-shell.css";
import "@ludecker/ui/docs-header.css";
import "@ludecker/ui/docs-hero.css";
import "@ludecker/ui/docs-nav.css";
import "@ludecker/ui/docs-toc.css";
import "@ludecker/ui/docs-sidebar-panel.css";
import "@ludecker/ui/docs-content.css";
import "@ludecker/ui/theme-toggle.css";
import "@ludecker/ui/article-list.css";
import "@ludecker/ui/article-body.css";
import "@ludecker/ui/skill-article-body.css";
import "@ludecker/ui/article-mermaid-diagram.css";
import "@ludecker/ui/content-section.css";
import "@ludecker/ui/globals.css";
import "./intro-animation.css";
import { AppProviders } from "@/components/AppProviders";
import { SITE_CONFIG } from "@/lib/constants";
import { parseDocsNavOverridesCookie } from "@/lib/nav/parse-docs-nav-overrides-cookie";
import { DOCS_NAV_OVERRIDES_COOKIE } from "@ludecker/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialNavOverrides = parseDocsNavOverridesCookie(
    cookieStore.get(DOCS_NAV_OVERRIDES_COOKIE)?.value,
  );

  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className={TEXT_BODY_CLASS}>
        <AppProviders initialNavOverrides={initialNavOverrides}>{children}</AppProviders>
      </body>
    </html>
  );
}
