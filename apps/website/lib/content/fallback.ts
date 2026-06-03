import type { ContentWithTags } from "@ludecker/types";

const now = new Date().toISOString();

export const FALLBACK_HOME: ContentWithTags = {
  id: "fallback-home",
  title: "Lüdecker",
  slug: "home",
  excerpt:
    "Notes on design systems, editorial tools, and building with clarity.",
  content: [
    "C: Lüdecker",
    "",
    "P1: Welcome. Connect Supabase to load published content from the CMS.",
    "",
    "Predicate form: Type · page · Tags · intro",
  ].join("\n"),
  status: "published",
  article_type: "page",
  cover_image: null,
  seo_title: "Lüdecker",
  seo_description: "Writing on design, technology, and practice.",
  featured: true,
  published_at: now,
  created_at: now,
  updated_at: now,
  tags: [{ id: "t1", name: "intro", slug: "intro", created_at: now }],
};

export const FALLBACK_ARTICLES: ContentWithTags[] = [
  {
    id: "fallback-1",
    title: "Predicate blocks in editorial UI",
    slug: "predicate-blocks",
    excerpt: "How labeled metadata rows support scan-friendly reading.",
    content: "P1: Sample article body with predicate-friendly structure.",
    status: "published",
    article_type: "article",
    tags: [
      {
        id: "t2",
        name: "design",
        slug: "design",
        created_at: now,
      },
    ],
    cover_image: null,
    seo_title: null,
    seo_description: null,
    featured: false,
    published_at: now,
    created_at: now,
    updated_at: now,
  },
  {
    id: "fallback-2",
    title: "SSG with on-demand revalidation",
    slug: "ssg-revalidation",
    excerpt: "Static generation with a CMS-backed publish workflow.",
    content: "P1: Sample guide body.",
    status: "published",
    article_type: "guide",
    tags: [
      {
        id: "t3",
        name: "nextjs",
        slug: "nextjs",
        created_at: now,
      },
    ],
    cover_image: null,
    seo_title: null,
    seo_description: null,
    featured: false,
    published_at: now,
    created_at: now,
    updated_at: now,
  },
];
