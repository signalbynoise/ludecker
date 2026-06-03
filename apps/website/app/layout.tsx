import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Mono } from "next/font/google";
import "@ludecker/ui/tokens.css";
import "@ludecker/ui/typography.css";
import "@ludecker/ui/page-shell.css";
import "@ludecker/ui/site-layout.css";
import "@ludecker/ui/brand-logo.css";
import "@ludecker/ui/site-nav.css";
import "@ludecker/ui/footer.css";
import "@ludecker/ui/article-list.css";
import "@ludecker/ui/article-body.css";
import "@ludecker/ui/article-mermaid-diagram.css";
import "@ludecker/ui/content-section.css";
import "@ludecker/ui/globals.css";
import "./intro-animation.css";
import { SITE_CONFIG } from "@/lib/constants";
import { TEXT_BODY_CLASS } from "@ludecker/ui";

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={atkinsonMono.variable}>
      <body className={TEXT_BODY_CLASS}>{children}</body>
    </html>
  );
}
