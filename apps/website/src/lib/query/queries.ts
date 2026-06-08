import { compareContentForAdmin } from "@ludecker/types";
import { queryOptions } from "@tanstack/react-query";
import type { PageContext } from "@/lib/content/fetch-page-context";
import {
  fetchAdminContentById,
  fetchAdminContentList,
  fetchSession,
} from "@/lib/api/cms";
import {
  fetchGettingStarted,
  fetchNpmDownloads,
  fetchPublicContent,
  fetchPublicHome,
  fetchPublicHomeMarkdown,
  fetchPublicMarkdown,
  fetchPublicPageContext,
  fetchPublicSearchIndex,
  fetchPublicSection,
} from "@/lib/api/public";
import { FALLBACK_ARTICLES, FALLBACK_HOME } from "@/lib/content/fallback";
import { buildPublicSearchIndex } from "@/lib/content/search-index";
import { mapDocsNavEntries } from "@/lib/nav/map-docs-nav-entries";
import { NPM_DOWNLOADS_CACHE_SECONDS } from "@/lib/constants";
import { queryKeys } from "@/src/lib/query/keys";

const npmDownloadsStaleMs = NPM_DOWNLOADS_CACHE_SECONDS * 1000;

const emptyPageContext: PageContext = {
  hero: { title: "", description: "" },
  toc: [],
};

export function publicSearchIndexQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.public.searchIndex,
    staleTime: 0,
    queryFn: async () => {
      try {
        return await fetchPublicSearchIndex();
      } catch {
        return buildPublicSearchIndex([FALLBACK_HOME, ...FALLBACK_ARTICLES]);
      }
    },
  });
}

export function npmDownloadsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.public.npmDownloads,
    staleTime: npmDownloadsStaleMs,
    refetchInterval: npmDownloadsStaleMs,
    queryFn: async () => {
      const response = await fetchNpmDownloads();
      return response.weeklyDownloads;
    },
  });
}

export function gettingStartedNavQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.public.gettingStarted,
    staleTime: 0,
    queryFn: async () => {
      try {
        const items = await fetchGettingStarted();
        return mapDocsNavEntries(items);
      } catch {
        return [];
      }
    },
  });
}

export function publicHomeQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.public.home,
    staleTime: 0,
    queryFn: () => fetchPublicHome().catch(() => null),
  });
}

export function publicHomeMarkdownQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.public.homeMarkdown,
    staleTime: 0,
    queryFn: () => fetchPublicHomeMarkdown(),
  });
}

export function publicPageContextQueryOptions(pathname: string) {
  return queryOptions({
    queryKey: queryKeys.public.pageContext(pathname),
    staleTime: 0,
    queryFn: () =>
      fetchPublicPageContext(pathname).catch(() => emptyPageContext),
  });
}

export function publicSectionQueryOptions(typeSegment: string) {
  return queryOptions({
    queryKey: queryKeys.public.section(typeSegment),
    staleTime: 0,
    queryFn: () => fetchPublicSection(typeSegment).catch(() => []),
  });
}

export function publicArticleQueryOptions(typeSegment: string, slug: string) {
  return queryOptions({
    queryKey: queryKeys.public.article(typeSegment, slug),
    staleTime: 0,
    queryFn: () => fetchPublicContent(typeSegment, slug).catch(() => null),
  });
}

export function publicMarkdownQueryOptions(typeSegment: string, slug: string) {
  return queryOptions({
    queryKey: queryKeys.public.markdown(typeSegment, slug),
    staleTime: 0,
    queryFn: () => fetchPublicMarkdown(typeSegment, slug),
  });
}

export function adminContentListQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.admin.contentList,
    staleTime: 0,
    queryFn: async () => {
      const items = await fetchAdminContentList().catch(() => []);
      return [...items].sort(compareContentForAdmin);
    },
  });
}

export function adminContentQueryOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.admin.content(id),
    staleTime: 0,
    queryFn: () => fetchAdminContentById(id),
  });
}

export function adminSessionQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.admin.session,
    queryFn: () => fetchSession(),
    retry: false,
  });
}
