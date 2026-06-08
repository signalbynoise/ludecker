import type { ContentWithTags, PublicSearchItem } from "@ludecker/types";
import type { PageContext } from "@/lib/content/fetch-page-context";
import { apiFetch } from "./client";

export function fetchPublicHome(): Promise<ContentWithTags | null> {
  return apiFetch("/api/public/home");
}

export function fetchPublicHomeMarkdown(): Promise<PublicMarkdownExport> {
  return apiFetch("/api/public/home/markdown");
}

export function fetchPublicSection(
  typeSegment: string,
): Promise<ContentWithTags[]> {
  return apiFetch(`/api/public/${typeSegment}`);
}

export function fetchPublicContent(
  typeSegment: string,
  slug: string,
): Promise<ContentWithTags> {
  return apiFetch(`/api/public/${typeSegment}/${slug}`);
}

export interface PublicMarkdownExport {
  title: string;
  markdown: string;
}

export function fetchPublicMarkdown(
  typeSegment: string,
  slug: string,
): Promise<PublicMarkdownExport> {
  return apiFetch(`/api/public/${typeSegment}/${slug}/markdown`);
}

export function fetchPublicPageContext(pathname: string): Promise<PageContext> {
  return apiFetch(`/api/public/page-context?pathname=${encodeURIComponent(pathname)}`);
}

export function fetchGettingStarted(): Promise<ContentWithTags[]> {
  return apiFetch("/api/public/getting-started");
}

export function fetchPublicSearchIndex(): Promise<PublicSearchItem[]> {
  return apiFetch("/api/public/search-index");
}

export interface NpmDownloadsResponse {
  weeklyDownloads: number;
}

export function fetchNpmDownloads(): Promise<NpmDownloadsResponse> {
  return apiFetch("/api/public/npm-downloads");
}
