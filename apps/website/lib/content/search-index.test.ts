import { describe, expect, it } from "vitest";
import type { ContentWithTags } from "@ludecker/types";
import { GETTING_STARTED_TAG_SLUG } from "@ludecker/types";
import {
  SEARCH_GROUP_GETTING_STARTED,
  SEARCH_GROUP_PAGES,
  buildPublicSearchIndex,
} from "./search-index";

const now = new Date().toISOString();

function makeItem(
  overrides: Partial<ContentWithTags> & Pick<ContentWithTags, "title" | "slug" | "article_type">,
): ContentWithTags {
  return {
    id: overrides.id ?? "id",
    excerpt: overrides.excerpt ?? null,
    content: overrides.content ?? "",
    status: "published",
    cover_image: null,
    seo_title: null,
    seo_description: null,
    featured: false,
    published_at: now,
    created_at: now,
    updated_at: now,
    tags: overrides.tags ?? [],
    ...overrides,
  };
}

describe("buildPublicSearchIndex", () => {
  it("includes section pages and dedupes by href", () => {
    const index = buildPublicSearchIndex([
      makeItem({
        title: "guides",
        slug: "index",
        article_type: "guides",
      }),
      makeItem({
        title: "First guide",
        slug: "first",
        article_type: "guides",
      }),
    ]);

    const guideSection = index.find((entry) => entry.href === "/guide");
    const guideEntry = index.find((entry) => entry.href === "/guide/first");

    expect(guideSection).toMatchObject({
      title: "guides",
      group: SEARCH_GROUP_PAGES,
    });
    expect(guideEntry).toMatchObject({
      title: "First guide",
      group: "guides",
    });
    expect(index.filter((entry) => entry.href === "/guide")).toHaveLength(1);
  });

  it("tags getting started entries", () => {
    const index = buildPublicSearchIndex([
      makeItem({
        title: "Start here",
        slug: "start",
        article_type: "guides",
        tags: [
          {
            id: "t1",
            name: "Getting Started",
            slug: GETTING_STARTED_TAG_SLUG,
            created_at: now,
          },
        ],
      }),
    ]);

    const entry = index.find((item) => item.href === "/guide/start");
    expect(entry?.group).toBe(SEARCH_GROUP_GETTING_STARTED);
  });
});
