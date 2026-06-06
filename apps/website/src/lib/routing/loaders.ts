import type { QueryClient } from "@tanstack/react-query";
import { FALLBACK_ARTICLES, FALLBACK_HOME } from "@/lib/content/fallback";
import { buildContentPathname, buildSectionPathname } from "@/lib/routing/pathname";
import { queryKeys } from "@/src/lib/query/keys";
import {
  adminContentListQueryOptions,
  adminContentQueryOptions,
  adminSessionQueryOptions,
  gettingStartedNavQueryOptions,
  publicArticleQueryOptions,
  publicHomeQueryOptions,
  publicMarkdownQueryOptions,
  publicPageContextQueryOptions,
  publicSectionQueryOptions,
} from "@/src/lib/query/queries";
import { assertListableSection } from "@/src/lib/routing/section";

export async function loadGettingStartedNav(queryClient: QueryClient) {
  return queryClient.ensureQueryData(gettingStartedNavQueryOptions());
}

export async function loadHomeRoute(queryClient: QueryClient) {
  const [home, pageContext] = await Promise.all([
    queryClient.ensureQueryData(publicHomeQueryOptions()),
    queryClient.ensureQueryData(publicPageContextQueryOptions("/")),
  ]);

  return {
    home: home ?? FALLBACK_HOME,
    pageContext,
  };
}

export async function loadSectionRoute(
  queryClient: QueryClient,
  typeSegment: string,
) {
  const articleType = assertListableSection(typeSegment);
  const pathname = buildSectionPathname(typeSegment);

  const [items, pageContext] = await Promise.all([
    queryClient.ensureQueryData(publicSectionQueryOptions(typeSegment)),
    queryClient.ensureQueryData(publicPageContextQueryOptions(pathname)),
  ]);

  const rows =
    items.length > 0
      ? items
      : FALLBACK_ARTICLES.filter((entry) => entry.article_type === articleType);

  return { articleType, typeSegment, rows, pageContext };
}

export async function loadArticleRoute(
  queryClient: QueryClient,
  typeSegment: string,
  slug: string,
) {
  const articleType = assertListableSection(typeSegment);
  const pathname = buildContentPathname(typeSegment, slug);

  const [item, pageContext] = await Promise.all([
    queryClient.ensureQueryData(publicArticleQueryOptions(typeSegment, slug)),
    queryClient.ensureQueryData(publicPageContextQueryOptions(pathname)),
  ]);

  if (!item) {
    throw new Error("NOT_FOUND");
  }

  return { articleType, typeSegment, slug, item, pageContext, pathname };
}

export async function loadRawMarkdownRoute(
  queryClient: QueryClient,
  typeSegment: string,
  slug: string,
) {
  assertListableSection(typeSegment);
  const data = await queryClient.ensureQueryData(
    publicMarkdownQueryOptions(typeSegment, slug),
  );
  return data;
}

export async function loadAdminDashboard(queryClient: QueryClient) {
  const items = await queryClient.fetchQuery(
    adminContentListQueryOptions(),
  );
  return { items };
}

export async function loadAdminContentEdit(
  queryClient: QueryClient,
  id: string,
) {
  try {
    const content = await queryClient.fetchQuery(
      adminContentQueryOptions(id),
    );
    return { content };
  } catch {
    throw new Error("NOT_FOUND");
  }
}

export async function isAuthenticatedSession(
  queryClient: QueryClient,
): Promise<boolean> {
  try {
    await queryClient.fetchQuery(adminSessionQueryOptions());
    return true;
  } catch {
    return false;
  }
}

export async function invalidateContentQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.public.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
  ]);
}
