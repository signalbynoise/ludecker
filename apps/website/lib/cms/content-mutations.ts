import type {
  ArticleType,
  ContentFormState,
  ContentStatus,
} from "@ludecker/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@ludecker/utils";
import {
  CONTENT_STORAGE_BUCKET,
  CONTENT_TABLE,
  HOME_INTRO,
} from "@/lib/constants";
import { invalidatePublicContent } from "@/lib/content/invalidate-public";
import { syncContentTags } from "@/lib/content/tags";
import {
  normalizeContentFormState,
  validateContentFormState,
} from "@/lib/content/validate-form";

const log = createLogger("cms:content-mutations");

function isHomeIntro(
  articleType: ContentFormState["article_type"],
  slug: string,
): boolean {
  return articleType === HOME_INTRO.articleType && slug === HOME_INTRO.slug;
}

function toRowPayload(input: ContentFormState) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt || null,
    content: input.content,
    status: input.status,
    article_type: input.article_type,
    cover_image: input.cover_image || null,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    featured: isHomeIntro(input.article_type, input.slug) ? true : input.featured,
    published_at:
      input.status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

function invalidatePaths(articleType: ArticleType, slug: string) {
  invalidatePublicContent(articleType, slug);
}

export async function createContent(
  supabase: SupabaseClient,
  input: ContentFormState,
): Promise<{ id: string } | { error: string }> {
  log.info("createContent", "start");
  const normalized = normalizeContentFormState(input);
  const validationError = validateContentFormState(normalized);
  if (validationError) {
    return { error: validationError };
  }

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .insert(toRowPayload(normalized))
    .select("id, article_type, slug")
    .single();

  if (error) {
    log.error("createContent", "failed", { message: error.message });
    return { error: error.message };
  }

  try {
    await syncContentTags(supabase, String(data.id), normalized.tagNames);
  } catch (tagError) {
    const message =
      tagError instanceof Error ? tagError.message : "Tag sync failed";
    return { error: message };
  }

  invalidatePaths(String(data.article_type) as ArticleType, String(data.slug));
  return { id: String(data.id) };
}

export async function updateContent(
  supabase: SupabaseClient,
  id: string,
  input: ContentFormState,
): Promise<{ ok: true } | { error: string }> {
  log.info("updateContent", "start", { id });
  const normalized = normalizeContentFormState(input);
  const validationError = validateContentFormState(normalized);
  if (validationError) {
    return { error: validationError };
  }

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .update(toRowPayload(normalized))
    .eq("id", id)
    .select("article_type, slug")
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await syncContentTags(supabase, id, normalized.tagNames);
  } catch (tagError) {
    const message =
      tagError instanceof Error ? tagError.message : "Tag sync failed";
    return { error: message };
  }

  invalidatePaths(String(data.article_type) as ArticleType, String(data.slug));
  return { ok: true };
}

export async function deleteContent(
  supabase: SupabaseClient,
  id: string,
): Promise<{ ok: true } | { error: string }> {
  log.info("deleteContent", "start", { id });
  const { error } = await supabase.from(CONTENT_TABLE).delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  invalidatePublicContent("home" as ArticleType, HOME_INTRO.slug);
  return { ok: true };
}

interface StatusChangeRow {
  article_type: string;
  slug: string;
}

async function updateContentStatusBatch(
  supabase: SupabaseClient,
  ids: string[],
  status: ContentStatus,
): Promise<
  | { rows: StatusChangeRow[]; contentIds: string[] }
  | { error: string }
> {
  const contentIds = [...new Set(ids.filter((id) => id.length > 0))];
  if (contentIds.length === 0) {
    return { error: "No items selected" };
  }

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .update({
      status,
      published_at:
        status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .in("id", contentIds)
    .select("article_type, slug");

  if (error) {
    return { error: error.message };
  }

  return { rows: data ?? [], contentIds };
}

function invalidateAfterStatusChange(rows: StatusChangeRow[]) {
  for (const row of rows) {
    invalidatePaths(String(row.article_type) as ArticleType, String(row.slug));
  }
}

export async function setPublishState(
  supabase: SupabaseClient,
  id: string,
  status: ContentStatus,
): Promise<{ ok: true } | { error: string }> {
  const result = await updateContentStatusBatch(supabase, [id], status);
  if ("error" in result) {
    return { error: result.error };
  }
  invalidateAfterStatusChange(result.rows);
  return { ok: true };
}

export async function bulkSetContentStatus(
  supabase: SupabaseClient,
  ids: string[],
  status: ContentStatus,
): Promise<{ ok: true; updated: number } | { error: string }> {
  const result = await updateContentStatusBatch(supabase, ids, status);
  if ("error" in result) {
    return { error: result.error };
  }
  invalidateAfterStatusChange(result.rows);
  return { ok: true, updated: result.rows.length };
}

export async function uploadCoverImage(
  supabase: SupabaseClient,
  userId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(CONTENT_STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(CONTENT_STORAGE_BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}
