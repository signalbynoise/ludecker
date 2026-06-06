import type { ContentWithTags } from "@ludecker/types";
import { sortContentByPublishedAt } from "@ludecker/utils";
import { CONTENT_TABLE } from "@/lib/constants";
import { createLogger } from "@ludecker/utils";
import {
  CONTENT_SELECT,
  mapContentWithTagsRow,
} from "@/lib/content/map-content";
import type { SupabaseClient } from "@supabase/supabase-js";

const log = createLogger("content:admin-queries");

export async function fetchAllContentForAdmin(
  supabase: SupabaseClient,
): Promise<ContentWithTags[]> {
  log.debug("fetchAllContentForAdmin", "start");
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select(CONTENT_SELECT);

  if (error) {
    log.error("fetchAllContentForAdmin", "failed", { message: error.message });
    throw error;
  }

  return sortContentByPublishedAt((data ?? []).map(mapContentWithTagsRow));
}

export async function fetchContentByIdForAdmin(
  supabase: SupabaseClient,
  id: string,
): Promise<ContentWithTags | null> {
  log.debug("fetchContentByIdForAdmin", "start", { id });
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select(CONTENT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    log.error("fetchContentByIdForAdmin", "failed", { message: error.message });
    throw error;
  }

  return data ? mapContentWithTagsRow(data) : null;
}
