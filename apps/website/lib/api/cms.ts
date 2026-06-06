import type {
  ContentFormState,
  ContentStatus,
  ContentWithTags,
} from "@ludecker/types";
import { apiFetch } from "./client";

export function fetchAdminContentList(): Promise<ContentWithTags[]> {
  return apiFetch("/api/content");
}

export function fetchAdminContentById(id: string): Promise<ContentWithTags> {
  return apiFetch(`/api/content/${id}`);
}

export function createContent(
  input: ContentFormState,
): Promise<{ id: string } | { error: string }> {
  return apiFetch("/api/content", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateContent(
  id: string,
  input: ContentFormState,
): Promise<{ ok: true } | { error: string }> {
  return apiFetch(`/api/content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteContent(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  return apiFetch(`/api/content/${id}`, { method: "DELETE" });
}

export function publishContent(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  return apiFetch(`/api/content/${id}/publish`, { method: "POST" });
}

export function unpublishContent(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  return apiFetch(`/api/content/${id}/unpublish`, { method: "POST" });
}

export function bulkSetContentStatus(
  ids: string[],
  status: ContentStatus,
): Promise<{ ok: true; updated: number } | { error: string }> {
  return apiFetch("/api/content/bulk-status", {
    method: "PATCH",
    body: JSON.stringify({ ids, status }),
  });
}

export async function uploadCoverImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/content/upload-cover", {
    method: "POST",
    credentials: "include",
    body,
  });
  return response.json();
}

export function fetchSession(): Promise<{ user: { id: string; email?: string } }> {
  return apiFetch("/api/auth/session");
}
