import type { ContentWithTags, PublicSearchItem } from "@ludecker/types";
import {
  GETTING_STARTED_TAG_SLUG,
  NAV_ITEMS,
  SECTION_PAGE_SLUG,
  getSectionLabel,
} from "@ludecker/types";
import { getContentPublicPath } from "@ludecker/utils";

export const SEARCH_GROUP_PAGES = "Pages";
export const SEARCH_GROUP_GETTING_STARTED = "Getting started";

function addUnique(
  byHref: Map<string, PublicSearchItem>,
  item: PublicSearchItem,
): void {
  if (!byHref.has(item.href)) {
    byHref.set(item.href, item);
  }
}

export function buildPublicSearchIndex(
  items: readonly ContentWithTags[],
): PublicSearchItem[] {
  const byHref = new Map<string, PublicSearchItem>();

  for (const nav of NAV_ITEMS) {
    addUnique(byHref, {
      id: `section:${nav.id}`,
      title: nav.label,
      excerpt: null,
      href: nav.href,
      group: SEARCH_GROUP_PAGES,
    });
  }

  const home = items.find(
    (item) => item.article_type === "home" && item.slug === "home",
  );

  addUnique(byHref, {
    id: "page:home",
    title: home?.title ?? "home",
    excerpt: home?.excerpt ?? null,
    href: "/",
    group: SEARCH_GROUP_PAGES,
  });

  for (const item of items) {
    if (item.article_type === "home") {
      continue;
    }

    if (item.slug === SECTION_PAGE_SLUG) {
      continue;
    }

    const isGettingStarted = item.tags.some(
      (tag) => tag.slug === GETTING_STARTED_TAG_SLUG,
    );

    addUnique(byHref, {
      id: `${item.article_type}:${item.slug}`,
      title: item.title,
      excerpt: item.excerpt,
      href: getContentPublicPath(item.article_type, item.slug),
      group: isGettingStarted
        ? SEARCH_GROUP_GETTING_STARTED
        : getSectionLabel(item.article_type),
    });
  }

  return Array.from(byHref.values());
}
