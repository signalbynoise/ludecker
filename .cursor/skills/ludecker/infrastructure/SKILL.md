---
name: infrastructure
description: Apply Render blueprint, Supabase migration, env, and ISR revalidation workflows when editing render.yaml, docs/deployment.md, supabase/migrations, or production env configuration.
disable-model-invocation: true
---

# Infrastructure

## Instructions

1. **Blueprint** — infrastructure SSOT is `render.yaml`. Sync from git; avoid orphan dashboard-only changes per [Render Blueprints](https://render.com/docs/infrastructure-as-code).
2. **Migrations** — all schema changes via `supabase/migrations/`; never edit remote schema in the SQL editor for tracked environments ([Supabase migrations](https://supabase.com/docs/guides/deployment/database-migrations)).
3. **Next.js service** — SSR/API/ISR needs a Render **web** service running `next start` ([Deploy Next.js](https://render.com/docs/deploy-nextjs-app)).
4. **Env** — document required vars in `docs/deployment.md`: `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`.
5. **Publish hook** — after CMS persist, `.cursor/skills/write-article/scripts/persist-content.mjs` calls `POST /api/revalidate` when env is set.
6. **Separate DDL and seed** — idempotent seeds (`ON CONFLICT`); wrap multi-statement DDL in transactions unless using `CREATE INDEX CONCURRENTLY` (separate file).

## Repo anchors

- `render.yaml`
- `docs/deployment.md`
- `apps/website/app/api/revalidate/route.ts`
- `apps/website/instrumentation.ts`

## Never

- Push secrets into the repo or skill bodies
- Run destructive `supabase db` commands on production without explicit user approval
- Skip staging migration test before production

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [Render — Infrastructure as code](https://render.com/docs/infrastructure-as-code)
- [Supabase — Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Render — Blueprint spec](https://render.com/docs/blueprint-spec)
