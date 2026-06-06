---
name: cms-inventory
description: >-
  Lüdecker public site and CMS admin: Next.js routes, content queries, server
  actions, admin UI, ISR revalidation, and docs shell integration.
argument-hint: "<change description or path under apps/website scope>"
effort: medium
disable-model-invocation: true
---

# Lüdecker Website & CMS — Inventory

**Implementation:** [governance/implementation/SKILL.md](../../../skills/shared/governance/implementation/SKILL.md)

**Architecture:** [docs/architecture.md](../../../docs/architecture.md), [docs/content-model.md](../../../docs/content-model.md)

---

## 1. Module identity

| Field | Value |
|-------|-------|
| **Product name** | Lüdecker Website & CMS |
| **Technical slug** | `cms` |
| **In one sentence** | Next.js public site + authenticated CMS at `/admin`, content from Supabase via SSG/ISR. |
| **Out of scope** | `packages/ui` component internals (use `ui` domain), raw migrations (use `database` domain), write-article swarm scripts (use `/write-article`) |

---

## 2. Constraints (module-specific)

- **CMS flow** — admin form → `app/admin/actions/content.ts` → Supabase → `revalidatePath` / `lib/content/revalidate-public.ts`
- **Public reads** — `lib/content/queries.ts` only; no Supabase in route components or `packages/ui`
- **SSOT** — `SITE_CONFIG` in `lib/constants.ts`; nav/types in `packages/types`; brand in `packages/ui/src/constants.ts`
- **Rendering** — public routes SSG/ISR (`revalidate = 3600`); `/admin/*` dynamic
- **Auth** — Supabase Auth + middleware session checks on CMS routes
- **Import direction** — `packages/ui` must not import `apps/website`

**Layer map:**

| Change type | Location | Must NOT |
|-------------|----------|----------|
| Public routes | `app/(public)/` | Direct Supabase queries in pages |
| Admin UI | `app/admin/` | Business rules inline >15 lines |
| Server actions | `app/admin/actions/content.ts` | UI imports |
| Content domain | `lib/content/` | React/Next in pure mappers |
| Supabase adapters | `lib/supabase/` | Browser service role |
| Site components | `components/` | Fetch orchestration — use lib |
| Nav helpers | `lib/nav/` | Duplicate NAV_ITEMS |

---

## 3. Module inventory (auto-maintained)

> **Last synced:** 2026-06-06 — refresh in Phase 8 of every update run.

### Entry points

- **Public:** `/`, `/[type]`, `/[type]/[slug]` — SSG/ISR
- **Admin:** `/admin`, `/admin/login`, `/admin/content/new`, `/admin/content/[id]/edit`
- **API:** `app/api/revalidate/route.ts` — on-demand ISR

### Files by layer

| Path | Role |
|------|------|
| `app/(public)/page.tsx` | Home |
| `app/(public)/[type]/page.tsx` | Type list |
| `app/(public)/[type]/[slug]/page.tsx` | Article/page detail |
| `app/(public)/layout.tsx`, `SiteNavActive.tsx` | Public chrome |
| `app/admin/actions/content.ts` | CMS server actions |
| `app/admin/components/*` | Admin forms and lists |
| `app/admin/hooks/*` | Admin UI state |
| `lib/content/queries.ts` | Public content reads |
| `lib/content/map-content.ts` | Row → domain mapping |
| `lib/content/revalidate-public.ts` | ISR paths |
| `lib/content/fetch-page-context.ts`, `fetch-page-hero.ts` | Docs/page context |
| `lib/supabase/server.ts`, `client.ts`, `middleware.ts` | Supabase clients |
| `lib/constants.ts` | SITE_CONFIG |
| `lib/nav/resolve-active-nav-id.ts` | Nav active state |
| `components/DocsChrome.tsx`, `DocsLayoutClient.tsx` | Docs shell bridge |
| `components/AppProviders.tsx` | Client providers |
| `middleware.ts` | Auth gate |

### Tests and verification

- `pnpm typecheck` from repo root
- Manual: CMS publish → public page refresh
- `curl http://localhost:3000/` after `/launch-ludecker`

### Anti-patterns

- Query Supabase from `app/(public)/*` page files directly
- Duplicate constants from `SITE_CONFIG` or `packages/types`
- Side effects during render
- Inline styles in site components (use `@ludecker/ui` CSS)
