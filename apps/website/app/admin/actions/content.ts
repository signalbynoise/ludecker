"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ArticleType, ContentFormState, ContentStatus } from "@ludecker/types";
import { revalidatePublicContent } from "@/lib/content/revalidate-public";
import {
  CONTENT_STORAGE_BUCKET,
  CONTENT_TABLE,
  HOME_INTRO,
} from "@/lib/constants";
import { syncContentTags } from "@/lib/content/tags";
import {
  normalizeContentFormState,
  validateContentFormState,
} from "@/lib/content/validate-form";
import { createLogger } from "@ludecker/utils";
import { createClient } from "@/lib/supabase/server";

const log = createLogger("actions:content");

export type { ContentFormState } from "@ludecker/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    log.warn("requireUser", "unauthenticated");
    redirect("/admin/login");
  }

  return { supabase, user };
}

function revalidatePublicPaths(articleType: ContentFormState["article_type"], slug: string) {
  revalidatePublicContent(articleType, slug);
}

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

export async function createContentAction(
  input: ContentFormState,
): Promise<{ id: string } | { error: string }> {
  log.info("createContent", "start");
  const normalized = normalizeContentFormState(input);
  const validationError = validateContentFormState(normalized);
  if (validationError) {
    log.warn("createContent", "validation failed", { message: validationError });
    return { error: validationError };
  }

  const { supabase } = await requireUser();

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

  revalidatePublicPaths(String(data.article_type) as ArticleType, String(data.slug));
  log.info("createContent", "success", { id: data.id });
  return { id: String(data.id) };
}

export async function updateContentAction(
  id: string,
  input: ContentFormState,
): Promise<{ ok: true } | { error: string }> {
  log.info("updateContent", "start", { id });
  const normalized = normalizeContentFormState(input);
  const validationError = validateContentFormState(normalized);
  if (validationError) {
    log.warn("updateContent", "validation failed", { message: validationError });
    return { error: validationError };
  }

  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .update(toRowPayload(normalized))
    .eq("id", id)
    .select("article_type, slug")
    .single();

  if (error) {
    log.error("updateContent", "failed", { message: error.message });
    return { error: error.message };
  }

  try {
    await syncContentTags(supabase, id, normalized.tagNames);
  } catch (tagError) {
    const message =
      tagError instanceof Error ? tagError.message : "Tag sync failed";
    return { error: message };
  }

  revalidatePublicPaths(String(data.article_type) as ArticleType, String(data.slug));
  revalidatePath("/admin");
  revalidatePath(`/admin/content/${id}/edit`);
  log.info("updateContent", "success", { id });
  return { ok: true };
}

export async function deleteContentAction(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  log.info("deleteContent", "start", { id });
  const { supabase } = await requireUser();

  const { error } = await supabase.from(CONTENT_TABLE).delete().eq("id", id);

  if (error) {
    log.error("deleteContent", "failed", { message: error.message });
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  log.info("deleteContent", "success", { id });
  return { ok: true };
}

export async function publishContentAction(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  return setPublishState(id, "published");
}

export async function unpublishContentAction(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  return setPublishState(id, "draft");
}

export async function bulkSetContentStatusAction(
  ids: string[],
  status: ContentStatus,
): Promise<{ ok: true; updated: number } | { error: string }> {
  log.info("bulkSetContentStatus", "start", { count: ids.length, status });
  const result = await updateContentStatusBatch(ids, status);
  if ("error" in result) {
    return { error: result.error };
  }

  revalidateAfterStatusChange(result.rows, result.contentIds);
  log.info("bulkSetContentStatus", "success", { updated: result.rows.length });
  return { ok: true, updated: result.rows.length };
}

async function setPublishState(
  id: string,
  status: ContentStatus,
): Promise<{ ok: true } | { error: string }> {
  log.info("setPublishState", "start", { id, status });
  const result = await updateContentStatusBatch([id], status);
  if ("error" in result) {
    return { error: result.error };
  }

  revalidateAfterStatusChange(result.rows, result.contentIds);
  return { ok: true };
}

interface StatusChangeRow {
  article_type: string;
  slug: string;
}

async function updateContentStatusBatch(
  ids: string[],
  status: ContentStatus,
): Promise<
  | { rows: StatusChangeRow[]; contentIds: string[] }
  | { error: string }
> {
  const contentIds = [...new Set(ids.filter((id) => id.length > 0))];
  if (contentIds.length === 0) {
    log.warn("updateContentStatusBatch", "no ids");
    return { error: "No items selected" };
  }

  const { supabase } = await requireUser();
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
    log.error("updateContentStatusBatch", "failed", { message: error.message });
    return { error: error.message };
  }

  return { rows: data ?? [], contentIds };
}

function revalidateAfterStatusChange(
  rows: StatusChangeRow[],
  contentIds: string[],
) {
  for (const row of rows) {
    revalidatePublicPaths(String(row.article_type) as ArticleType, String(row.slug));
  }
  revalidatePath("/admin");
  for (const id of contentIds) {
    revalidatePath(`/admin/content/${id}/edit`);
  }
}

export async function uploadCoverImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  log.info("uploadCoverImage", "start");
  const { supabase, user } = await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided" };
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(CONTENT_STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) {
    log.error("uploadCoverImage", "upload failed", {
      message: uploadError.message,
    });
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(CONTENT_STORAGE_BUCKET).getPublicUrl(path);

  log.info("uploadCoverImage", "success");
  return { url: publicUrl };
}
