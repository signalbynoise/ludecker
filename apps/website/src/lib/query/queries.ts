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
  fetchPublicContent,
  fetchPublicHome,
  fetchPublicPageContext,
  fetchPublicSection,
} from "@/lib/api/public";
import { mapDocsNavEntries } from "@/lib/nav/map-docs-nav-entries";
import { queryKeys } from "@/src/lib/query/keys";

const emptyPageContext: PageContext = {
  hero: { title: "", description: "" },
  toc: [],
};

export function gettingStartedNavQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.public.gettingStarted,
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
    queryFn: () => fetchPublicHome().catch(() => null),
  });
}

export function publicPageContextQueryOptions(pathname: string) {
  return queryOptions({
    queryKey: queryKeys.public.pageContext(pathname),
    queryFn: () =>
      fetchPublicPageContext(pathname).catch(() => emptyPageContext),
  });
}

export function publicSectionQueryOptions(typeSegment: string) {
  return queryOptions({
    queryKey: queryKeys.public.section(typeSegment),
    queryFn: () => fetchPublicSection(typeSegment).catch(() => []),
  });
}

export function publicArticleQueryOptions(typeSegment: string, slug: string) {
  return queryOptions({
    queryKey: queryKeys.public.article(typeSegment, slug),
    queryFn: () => fetchPublicContent(typeSegment, slug).catch(() => null),
  });
}

export function adminContentListQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.admin.contentList,
    queryFn: async () => {
      const items = await fetchAdminContentList().catch(() => []);
      return [...items].sort(compareContentForAdmin);
    },
  });
}

export function adminContentQueryOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.admin.content(id),
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
