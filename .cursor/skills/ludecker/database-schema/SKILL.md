---
name: database-schema
description: Change Postgres schema via supabase/migrations with RLS, mirror types in packages/types, and map rows in map-content.ts when editing content, tags, or article_type enums.
---

# Database Schema

## Instructions

1. **Migration only** — create `supabase/migrations/<timestamp>_<name>.sql`. Never apply schema edits only in the remote dashboard for tracked envs.
2. **RLS in same migration** — `ENABLE ROW LEVEL SECURITY` and policies ship with the table. Review [RLS gotchas](https://www.dineshchalla.dev/supabase-rls-gotchas-triggers-fk-migrations/) for triggers and `ON DELETE SET NULL`.
3. **Uniqueness** — respect `(article_type, slug)` on `content` (`20250603200000_content_composite_slug.sql`).
4. **Type mirror** — update `packages/types/src/article-type.ts`, `content-form.ts`, and `content-section.ts` with schema changes.
5. **Mapping** — adjust `CONTENT_SELECT` and `mapContentRow` in `apps/website/lib/content/map-content.ts`.
6. **Seeds** — idempotent DML (`ON CONFLICT DO UPDATE`); separate heavy seed from DDL when possible.

## Repo anchors

- `supabase/migrations/` — full history
- `packages/types/src/article-type.ts` — `ARTICLE_TYPES`, `NAV_ITEMS`
- `supabase/seed.sql` — section index rows

## Never

- Ship a new public table without RLS
- Drift TS types from live columns
- Log row payloads containing PII at `info` in production
- Break published-only anonymous read policy without explicit product approval

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [Supabase — Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase RLS gotchas](https://www.dineshchalla.dev/supabase-rls-gotchas-triggers-fk-migrations/)
