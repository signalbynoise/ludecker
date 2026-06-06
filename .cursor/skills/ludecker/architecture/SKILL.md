---
name: architecture
description: Enforce monorepo layer boundaries, SSOT, and unidirectional CMS flow when changing apps/website, packages/ui, packages/types, packages/utils, or lib/content.
---

# Architecture

## Instructions

1. **Pick the owning layer** — UI renders (`packages/ui`); domain rules (`apps/website/lib/content`, `packages/utils`); infrastructure persists (`lib/supabase`, server actions, `supabase/migrations`). Do not mix responsibilities.
2. **SSOT check** — before adding a constant or token, find the owner: `SITE_CONFIG` in `apps/website/lib/constants.ts`, brand in `packages/ui/src/constants.ts`, nav/types in `packages/types/src/index.ts`, tokens in `packages/ui/src/tokens.css`.
3. **CMS flow** — admin form → `app/admin/actions/content.ts` → Supabase → `lib/content/revalidate-public.ts` / `revalidatePath`. Public reads go through `lib/content/queries.ts`, not ad-hoc clients in pages.
4. **Import direction** — `packages/ui` must not import `apps/website`. `packages/types` and `packages/utils` stay free of React/Next.js.
5. **Size** — respect module budgets in `docs/master_rules.md` §19; extract before adding large features to a single file.

## Repo anchors

- `docs/master_rules.md` — canonical rules
- `docs/architecture.md` — stack and data flow
- `.cursor/rules/master-rules.mdc` — Cursor always-on summary

## Never

- Duplicate site name, nav items, or tokens in a second file
- Query Supabase from route components or `packages/ui`
- Side effects during render
- Circular imports between `lib/content` modules

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [Separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth)
- [Cursor — Agent best practices](https://cursor.com/blog/agent-best-practices)
