export const SITE_CONFIG = {
  name: "Lüdecker",
  description:
    "Agentic Architecture as Code (AAAC) — design, technology, and practice.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "erik@ludecker.com",
} as const;

export const CMS_CONFIG = {
  title: `${SITE_CONFIG.name} CMS`,
} as const;

export const CONTENT_TABLE = "content" as const;
export const CONTENT_STORAGE_BUCKET = "content-images" as const;

/** Canonical CMS record for the public homepage body. */
export const HOME_INTRO = {
  articleType: "home",
  slug: "home",
} as const;

/** Reserved for future CDN tuning; public JSON API uses no-store / must-revalidate. */
export const REVALIDATE_SECONDS = 3600;

export const NPM_AAAC = {
  name: "@ludecker/aaac",
  packageUrl: "https://www.npmjs.com/package/@ludecker/aaac",
} as const;

/** Server + client refresh interval for npm weekly download stats. */
export const NPM_DOWNLOADS_CACHE_SECONDS = 86_400;
