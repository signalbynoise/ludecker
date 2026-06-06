import type { ArticleType, ContentWithTags } from "@ludecker/types";
import { GETTING_STARTED_TAG_SLUG } from "@ludecker/types";
import { SECTION_PAGE_SLUG } from "@ludecker/types";
import { sortContentByPublishedAt } from "@ludecker/utils";
import { CONTENT_TABLE, HOME_INTRO } from "@/lib/constants";
import { createLogger } from "@ludecker/utils";
import {
  CONTENT_SELECT,
  mapContentWithTagsRow,
} from "@/lib/content/map-content";
import { createAdminClient } from "@/lib/supabase/admin";

const log = createLogger("content:queries");

async function queryAdmin<T>(
  operation: string,
  run: (client: NonNullable<ReturnType<typeof createAdminClient>>) => Promise<T>,
): Promise<T | null> {
  const client = createAdminClient();
  if (!client) {
    log.warn(operation, "Admin client unavailable — skipping query");
    return null;
  }

  log.debug(operation, "start");
  try {
    const result = await run(client);
    log.debug(operation, "success");
    return result;
  } catch (error) {
    log.error(operation, "query failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}

async function fetchPublishedContent(): Promise<ContentWithTags[]> {
  const data = await queryAdmin("fetchPublishedContent", async (client) => {
    const { data: rows, error } = await client
      .from(CONTENT_TABLE)
      .select(CONTENT_SELECT)
      .eq("status", "published");

    if (error) throw error;
    return sortContentByPublishedAt((rows ?? []).map(mapContentWithTagsRow));
  });

  return data ?? [];
}

export async function fetchContentBySlug(
  type: ArticleType,
  slug: string,
): Promise<ContentWithTags | null> {
  const data = await queryAdmin("fetchContentBySlug", async (client) => {
    const { data: row, error } = await client
      .from(CONTENT_TABLE)
      .select(CONTENT_SELECT)
      .eq("status", "published")
      .eq("article_type", type)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    const mapped = row ? mapContentWithTagsRow(row) : null;
    if (mapped) {
      log.info("fetchContentBySlug", "resolved", {
        slug,
        type,
        contentLength: mapped.content.length,
      });
    }
    return mapped;
  });

  return data ?? null;
}

async function fetchContentByType(
  type: ArticleType,
): Promise<ContentWithTags[]> {
  const data = await queryAdmin("fetchContentByType", async (client) => {
    const { data: rows, error } = await client
      .from(CONTENT_TABLE)
      .select(CONTENT_SELECT)
      .eq("status", "published")
      .eq("article_type", type);

    if (error) throw error;
    return sortContentByPublishedAt((rows ?? []).map(mapContentWithTagsRow));
  });

  return data ?? [];
}

export async function fetchSectionPage(
  type: ArticleType,
): Promise<ContentWithTags | null> {
  if (type === "home") {
    return fetchHomePageContent();
  }

  return fetchContentBySlug(type, SECTION_PAGE_SLUG);
}

export async function fetchSectionEntries(
  type: ArticleType,
): Promise<ContentWithTags[]> {
  const items = await fetchContentByType(type);
  return items.filter((item) => item.slug !== SECTION_PAGE_SLUG);
}

export async function fetchGettingStartedEntries(): Promise<ContentWithTags[]> {
  const items = await fetchPublishedContent();
  return items.filter(
    (item) =>
      item.slug !== SECTION_PAGE_SLUG &&
      item.tags.some((tag) => tag.slug === GETTING_STARTED_TAG_SLUG),
  );
}

async function fetchFeaturedHomeContent(): Promise<ContentWithTags | null> {
  const data = await queryAdmin("fetchFeaturedHomeContent", async (client) => {
    const { data: row, error } = await client
      .from(CONTENT_TABLE)
      .select(CONTENT_SELECT)
      .eq("status", "published")
      .eq("featured", true)
      .eq("article_type", HOME_INTRO.articleType)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return row ? mapContentWithTagsRow(row) : null;
  });

  return data ?? null;
}

/**
 * Homepage intro: published `home` / `home` slug first, then any featured home entry.
 */
export async function fetchHomePageContent(): Promise<ContentWithTags | null> {
  const intro = await fetchContentBySlug(
    HOME_INTRO.articleType,
    HOME_INTRO.slug,
  );
  if (intro) {
    return intro;
  }

  return fetchFeaturedHomeContent();
}

export async function fetchAllPublishedSlugs(): Promise<
  { type: ArticleType; slug: string }[]
> {
  const data = await queryAdmin("fetchAllPublishedSlugs", async (client) => {
    const { data: rows, error } = await client
      .from(CONTENT_TABLE)
      .select("article_type, slug")
      .eq("status", "published")
      .neq("article_type", "home")
      .neq("slug", SECTION_PAGE_SLUG);

    if (error) throw error;

    const slugs = (rows ?? []) as { article_type: ArticleType; slug: string }[];
    return slugs.map((row) => ({
      type: row.article_type,
      slug: row.slug,
    }));
  });

  return data ?? [];
}
