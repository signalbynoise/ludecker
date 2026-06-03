export const SITE_CONFIG = {
  name: "Lüdecker",
  description: "Writing on design, technology, and practice.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "erik@ludecker.com",
} as const;

export const CONTENT_TABLE = "content" as const;
export const CONTENT_STORAGE_BUCKET = "content-images" as const;

export const REVALIDATE_SECONDS = 3600;
