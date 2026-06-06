---
name: api-first
description: Define TypeScript contracts and validation before implementation when adding server actions, revalidate API, persist scripts, or external HTTP APIs backed by OpenAPI.
---

# API First

## Instructions

1. **Internal CMS contract** — shape lives in `@ludecker/types` (`ContentFormState`, `ARTICLE_TYPES`). Validation in `apps/website/lib/content/validate-form.ts`. Server actions in `app/admin/actions/content.ts` consume normalized form state only.
2. **HTTP surface** — `POST /api/revalidate` validates `article_type` against `ARTICLE_TYPES` and requires `REVALIDATE_SECRET`. No undocumented body fields.
3. **Agent persist** — `.cursor/skills/write-article/scripts/persist-content.mjs` must match the same row shape as CMS; flags (`--publish`, `--update`) are part of the contract.
4. **External REST** — when adding public HTTP APIs, write OpenAPI first, review in PR, then implement ([contract-first](https://www.moesif.com/blog/technical/api-development/Mastering-Contract-First-API-Development-Key-Strategies-and-Benefits/)). Generate stubs/clients from spec; do not annotate code first.
5. **Change discipline** — schema migration + types + mapper + revalidate paths land in one logical change.

## Repo anchors

- `packages/types/src/content-form.ts`
- `apps/website/lib/content/validate-form.ts`
- `apps/website/app/api/revalidate/route.ts`
- `apps/website/lib/content/map-content.ts`

## Never

- Ad-hoc Supabase selects in pages bypassing `CONTENT_SELECT`
- Undocumented env vars for production behavior
- OpenAPI generated only after implementation ships
- Duplicate conflicting validation in UI and server

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [Moesif — Contract-first API development](https://www.moesif.com/blog/technical/api-development/Mastering-Contract-First-API-Development-Key-Strategies-and-Benefits/)
- [API-first design overview](https://blog.easecloud.io/cloud-infrastructure/api-first-design/)
- [Contract-first OpenAPI workflow](https://mdsanwarhossain.me/blog-contract-first-openapi.html)
