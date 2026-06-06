import type { ContentWithTags } from "@ludecker/types";

const now = new Date().toISOString();

export const FALLBACK_HOME: ContentWithTags = {
  id: "fallback-home",
  title: "Lüdecker",
  slug: "home",
  excerpt:
    "Agentic OS (AAAC) — design, technology, and practice for teams running Cursor agents with architecture in git.",
  content: [
    "## Welcome to Lüdecker",
    "",
    "This site is about **Agentic OS**—also called **Agentic Architecture as Code (AAAC)**. You run slash commands; the repo owns the workflow; every chat leaves a reviewable trail.",
    "",
    "If you build with Cursor on a shared codebase, start here. For the full story, read [Introducing Agentic OS](https://ludecker.com/articles/agentic-os).",
  ].join("\n"),
  status: "published",
  article_type: "home",
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
    title: "How labeled sections help readers scan",
    slug: "predicate-blocks",
    excerpt:
      "Short labeled sections make long pages easier to skim without changing what you write.",
    content: [
      "## Labeled sections make scanning easier",
      "",
      "Each section starts with a clear headline. Readers jump to what they need instead of reading top to bottom.",
    ].join("\n"),
    status: "published",
    article_type: "articles",
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
    title: "Static pages with fresh CMS content",
    slug: "ssg-revalidation",
    excerpt:
      "Pages are built ahead of time and refresh when you publish something new.",
    content: [
      "## Fast pages that update when you publish",
      "",
      "The site serves static HTML for speed. When you publish in the CMS, the site rebuilds just the pages that changed.",
    ].join("\n"),
    status: "published",
    article_type: "guides",
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
