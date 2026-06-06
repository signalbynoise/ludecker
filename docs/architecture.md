# Architecture

Personal website and lightweight CMS for lüdecker.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite 6 + React 19 + TanStack Router + TanStack Query |
| API | Hono on Node (`@hono/node-server`) |
| CMS | Custom admin UI at `/admin` |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (CMS only) |
| Storage | Supabase Storage (`content-images` bucket) |
| Hosting | Render (web service) |
| DNS / CDN | Cloudflare |
| Source control | GitHub |

## Deployment flow

```
GitHub → Render → Cloudflare → Production
```

1. Push to `main` triggers Render build.
2. Render runs `pnpm install` and `vite build` from the monorepo root.
3. Production starts `tsx server/index.ts`, which serves `/api/*` and static assets from `dist/`.
4. Cloudflare proxies traffic to Render with DNS, SSL, caching, and WAF.

## Monorepo layout

```
apps/website          Vite SPA + Hono API + CMS admin
  src/                TanStack Router routes, pages, layouts, admin UI
  server/             Hono routes (`/api/*`, raw markdown)
  lib/                API clients, content domain, Supabase client
packages/types        Shared TypeScript types
packages/utils        Slug, date, logging, content helpers
packages/ui           Design system (Figma tokens + components)
supabase/migrations   Database schema
supabase/seed         Sample content
docs/                 Architecture and runbooks
```

## Runtime architecture

```
Browser (Vite SPA)
  → fetch /api/public/*     public content, page context, nav
  → fetch /api/content/*    CMS CRUD (authenticated)
  → fetch /api/auth/*       session check
  → /:type/:slug/raw        markdown export (Hono)

Hono server
  → lib/content/queries     Supabase service role (server-only)
  → lib/cms/content-mutations
  → Supabase Auth cookies   session for CMS
```

| Route | Strategy |
|-------|----------|
| `/`, `/:type`, `/:type/:slug` | TanStack Router loaders + Query cache → `/api/public/*` |
| `/admin/*` | Client-side auth guard + `/api/content` |
| `/api/*` | Hono handlers (dynamic) |

Public pages load published content through the Hono public API. The publishable Supabase key is used for CMS client auth; the service role key stays server-only.

## Security

- Row Level Security on all public tables.
- Published content is readable anonymously; drafts require authentication.
- Service role key is never exposed to the browser.
- CMS routes protected by client auth guard (`fetchSession`) and API authorization.

## Design system

Tokens and components live in `@ludecker/ui`, derived from the [Figma design file](https://www.figma.com/design/yVYCZ1wlNQ0LMxL9is5lNV/LUDECKER):

- Background: `#000000`
- Primary text: `#ffffff`
- Frost text: `#cccccc` (active nav), `#7a7a7a` (muted)
- Font: Atkinson Hyperlegible Mono
- Spacing: 4 / 16 / 40 / 80 px

## Data flow

```
Supabase (content) → Hono public API → React pages → @ludecker/ui components
CMS form → fetch /api/content → Supabase (authenticated) → invalidate public cache
Write-article persist → Supabase → POST /api/revalidate (published + `--publish`)
```

## Development

```bash
pnpm --filter @ludecker/website dev
```

Runs Hono API on port 3000 and Vite dev server on port 3001. Vite proxies `/api/*` and `/:type/:slug/raw` to the API server.

## Principles

1. Simplicity over cleverness.
2. API-first content delivery.
3. One source of truth (Supabase for content, tokens for design).
4. Add complexity only when needed.

## Agent workflows

Slash commands and agent orchestration follow **Agentic Architecture as Code (AAAC)**. See [agentic_architecture.md](./agentic_architecture.md) for command syntax, domains (`cms`, `ui`, `database`), and release flow.
