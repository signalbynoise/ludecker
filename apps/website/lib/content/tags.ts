import { slugify } from "@ludecker/utils";
import { createLogger } from "@ludecker/utils";

const log = createLogger("content:tags");

export async function syncContentTags(
  supabase: Awaited<
    ReturnType<typeof import("@/lib/supabase/server").createClient>
  >,
  contentId: string,
  tagNames: string[],
): Promise<void> {
  const uniqueNames = [...new Set(tagNames.map((name) => name.trim()).filter(Boolean))];
  const tagIds: string[] = [];

  for (const name of uniqueNames) {
    const tagSlug = slugify(name);
    const { data: existing, error: lookupError } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", tagSlug)
      .maybeSingle();

    if (lookupError) {
      log.error("syncContentTags", "tag lookup failed", {
        message: lookupError.message,
      });
      throw lookupError;
    }

    if (existing?.id) {
      tagIds.push(String(existing.id));
      continue;
    }

    const { data: created, error: createError } = await supabase
      .from("tags")
      .insert({ name, slug: tagSlug })
      .select("id")
      .single();

    if (createError) {
      log.error("syncContentTags", "tag create failed", {
        message: createError.message,
      });
      throw createError;
    }

    tagIds.push(String(created.id));
  }

  const { error: deleteError } = await supabase
    .from("content_tags")
    .delete()
    .eq("content_id", contentId);

  if (deleteError) {
    log.error("syncContentTags", "unlink failed", { message: deleteError.message });
    throw deleteError;
  }

  if (tagIds.length === 0) return;

  const { error: linkError } = await supabase.from("content_tags").insert(
    tagIds.map((tagId) => ({
      content_id: contentId,
      tag_id: tagId,
    })),
  );

  if (linkError) {
    log.error("syncContentTags", "link failed", { message: linkError.message });
    throw linkError;
  }
}
