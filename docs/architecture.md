# Architecture

Personal website and lightweight CMS for lüdecker.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router, React Server Components) |
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
2. Render runs `pnpm install` and `next build` from the monorepo root.
3. Cloudflare proxies traffic to Render with DNS, SSL, caching, and WAF.

## Monorepo layout

```
apps/website          Next.js public site + CMS admin
packages/types        Shared TypeScript types
packages/utils        Slug, date, logging, content helpers
packages/ui           Design system (Figma tokens + components)
supabase/migrations   Database schema
supabase/seed         Sample content
docs/                 Architecture and runbooks
```

## Rendering strategy

| Route | Strategy |
|-------|----------|
| `/`, `/articles`, `/[type]`, `/[type]/[slug]` | SSG / ISR (`revalidate = 3600`) |
| `/admin/*` | Dynamic (auth + CRUD) |

Public pages fetch published content at build/revalidation time via the Supabase service role client (server-only). The publishable key is used for CMS client operations and auth.

## Security

- Row Level Security on all public tables.
- Published content is readable anonymously; drafts require authentication.
- Service role key is never exposed to the browser.
- CMS routes protected by middleware session checks.

## Design system

Tokens and components live in `@ludecker/ui`, derived from the [Figma design file](https://www.figma.com/design/yVYCZ1wlNQ0LMxL9is5lNV/LUDECKER):

- Background: `#000000`
- Primary text: `#ffffff`
- Frost text: `#cccccc` (active nav), `#7a7a7a` (muted)
- Font: Atkinson Hyperlegible Mono
- Spacing: 4 / 16 / 40 / 80 px

## Data flow

```
Supabase (content) → Server queries (SSG) → @ludecker/ui components → Static HTML
CMS form → Server actions → Supabase (authenticated) → revalidatePath → ISR refresh
Write-article persist → Supabase → POST /api/revalidate (published + `--publish`) → ISR refresh
```

## Principles

1. Simplicity over cleverness.
2. Static generation by default.
3. One source of truth (Supabase for content, tokens for design).
4. Add complexity only when needed.

## Agent workflows

Slash commands and agent orchestration follow **Agentic Architecture as Code (AAAC)**. See [agentic_architecture.md](./agentic_architecture.md) for command syntax, domains (`cms`, `ui`, `database`), and release flow.
