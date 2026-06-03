import type { ArticleType, ContentWithTags } from "@ludecker/types";
import { sortContentByPublishedAt } from "@ludecker/utils";
import { CONTENT_TABLE } from "@/lib/constants";
import { createLogger } from "@ludecker/utils";
import {
  CONTENT_SELECT,
  mapContentRow,
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

export async function fetchPublishedContent(): Promise<ContentWithTags[]> {
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
    return row ? mapContentWithTagsRow(row) : null;
  });

  return data ?? null;
}

export async function fetchContentByType(
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

export async function fetchFeaturedHomeContent(): Promise<ContentWithTags | null> {
  const data = await queryAdmin("fetchFeaturedHomeContent", async (client) => {
    const { data: row, error } = await client
      .from(CONTENT_TABLE)
      .select(CONTENT_SELECT)
      .eq("status", "published")
      .eq("featured", true)
      .eq("article_type", "page")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return row ? mapContentWithTagsRow(row) : null;
  });

  return data ?? null;
}

export async function fetchContentByTag(tagSlug: string): Promise<ContentWithTags[]> {
  const data = await queryAdmin("fetchContentByTag", async (client) => {
    const { data: rows, error } = await client
      .from(CONTENT_TABLE)
      .select(`${CONTENT_SELECT}`)
      .eq("status", "published")
      .eq("content_tags.tags.slug", tagSlug);

    if (error) throw error;
    return sortContentByPublishedAt((rows ?? []).map(mapContentWithTagsRow));
  });

  return data ?? [];
}

export async function fetchAllPublishedSlugs(): Promise<
  { type: ArticleType; slug: string }[]
> {
  const data = await queryAdmin("fetchAllPublishedSlugs", async (client) => {
    const { data: rows, error } = await client
      .from(CONTENT_TABLE)
      .select("article_type, slug")
      .eq("status", "published")
      .neq("article_type", "page");

    if (error) throw error;

    const slugs = (rows ?? []) as { article_type: ArticleType; slug: string }[];
    return slugs.map((row) => ({
      type: row.article_type,
      slug: row.slug,
    }));
  });

  return data ?? [];
}
