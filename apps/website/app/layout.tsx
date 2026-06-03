import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Mono } from "next/font/google";
import "@ludecker/ui/globals.css";
import { SITE_CONFIG } from "@/lib/constants";

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
      <body>{children}</body>
    </html>
  );
}
