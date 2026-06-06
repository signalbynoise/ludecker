import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { RootLayout } from "@/src/layouts/RootLayout";
import { PublicLayout } from "@/src/layouts/PublicLayout";
import { AdminLayout } from "@/src/layouts/AdminLayout";
import { HomePage } from "@/src/pages/HomePage";
import { TypeListPage } from "@/src/pages/TypeListPage";
import { ContentPage } from "@/src/pages/ContentPage";
import { RawMarkdownPage } from "@/src/pages/RawMarkdownPage";
import { NotFoundPage } from "@/src/pages/NotFoundPage";
import { AdminDashboardPage } from "@/src/pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "@/src/pages/admin/AdminLoginPage";
import { NewContentPage } from "@/src/pages/admin/NewContentPage";
import { EditContentPage } from "@/src/pages/admin/EditContentPage";
import { PagePending } from "@/src/components/PagePending";
import { queryClient } from "@/src/lib/query/client";
import {
  isAuthenticatedSession,
  loadAdminContentEdit,
  loadAdminDashboard,
  loadArticleRoute,
  loadGettingStartedNav,
  loadHomeRoute,
  loadRawMarkdownRoute,
  loadSectionRoute,
} from "@/src/lib/routing/loaders";
import { assertListableSection } from "@/src/lib/routing/section";

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  pendingComponent: PagePending,
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
  loader: ({ context: { queryClient: client } }) =>
    loadGettingStartedNav(client).then((gettingStartedEntries) => ({
      gettingStartedEntries,
    })),
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  loader: ({ context: { queryClient: client } }) => loadHomeRoute(client),
  component: HomePage,
});

const sectionRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "$type",
  beforeLoad: ({ params }) => {
    try {
      assertListableSection(params.type);
    } catch {
      throw notFound();
    }
  },
  loader: ({ context: { queryClient: client }, params }) =>
    loadSectionRoute(client, params.type),
  component: TypeListPage,
});

const rawMarkdownRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$type/$slug/raw",
  beforeLoad: ({ params }) => {
    try {
      assertListableSection(params.type);
    } catch {
      throw notFound();
    }
  },
  loader: async ({ context: { queryClient: client }, params }) => {
    try {
      return await loadRawMarkdownRoute(client, params.type, params.slug);
    } catch {
      throw notFound();
    }
  },
  component: RawMarkdownPage,
});

const articleRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "$type/$slug",
  beforeLoad: ({ params }) => {
    try {
      assertListableSection(params.type);
    } catch {
      throw notFound();
    }
  },
  loader: async ({ context: { queryClient: client }, params }) => {
    try {
      return await loadArticleRoute(client, params.type, params.slug);
    } catch {
      throw notFound();
    }
  },
  component: ContentPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "admin",
  component: AdminLayout,
  beforeLoad: async ({ context: { queryClient: client }, location }) => {
    const isLoginRoute = location.pathname === "/admin/login";
    const authenticated = await isAuthenticatedSession(client);

    if (!isLoginRoute && !authenticated) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }

    if (isLoginRoute && authenticated) {
      throw redirect({ to: "/admin" });
    }
  },
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  loader: ({ context: { queryClient: client } }) => loadAdminDashboard(client),
  component: AdminDashboardPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "login",
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect?: string } => ({
    redirect:
      typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: AdminLoginPage,
});

const adminNewContentRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "content/new",
  component: NewContentPage,
});

const adminEditContentRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "content/$id/edit",
  loader: async ({ context: { queryClient: client }, params }) => {
    try {
      return await loadAdminContentEdit(client, params.id);
    } catch {
      throw notFound();
    }
  },
  component: EditContentPage,
});

const routeTree = rootRoute.addChildren([
  rawMarkdownRoute,
  publicLayoutRoute.addChildren([homeRoute, articleRoute, sectionRoute]),
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminLoginRoute,
    adminNewContentRoute,
    adminEditContentRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingComponent: PagePending,
  defaultNotFoundComponent: NotFoundPage,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
