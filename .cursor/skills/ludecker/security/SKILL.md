---
name: security
description: Enforce RLS, secret handling, auth gates, and safe agent config when editing Supabase migrations, apps/website/lib/supabase, middleware, env, revalidate API, or .cursor skills and rules.
---

# Security

## Instructions

1. **Classify the change** — schema/RLS (`supabase/migrations/`), auth (`apps/website/lib/supabase/middleware.ts`, `server.ts`), server writes (`app/admin/actions/content.ts`), or cache purge (`app/api/revalidate/route.ts`).
2. **Secrets** — live only in env / host config. Never commit `.env*`, service role keys, or `REVALIDATE_SECRET`. Never paste secrets into prompts, skills, or logs.
3. **RLS** — enable on every new `public` table in the same migration as `CREATE POLICY`. Anonymous read only where product requires it (`status = 'published'` on `content`).
4. **Service role** — `lib/supabase/admin.ts` is server-only. Production must not rely on publishable key for writes.
5. **Boundaries** — validate CMS and API input via `apps/website/lib/content/validate-form.ts`. Log errors with `@ludecker/utils` `createLogger`; never log tokens or PII.
6. **Agent context** — keep `.env`, `*.pem`, `*.key`, credentials out of context (`.cursorignore`). Treat edits to `.cursor/skills` and rules as security-sensitive.

## Repo anchors

- `supabase/migrations/20250603120000_content_table.sql` — RLS baseline
- `apps/website/middleware.ts` — admin route protection
- `apps/website/app/api/revalidate/route.ts` — secret + `ARTICLE_TYPES` allowlist
- `docs/master_rules.md` — §13–16 validation and errors

## Never

- Disable RLS on public tables for convenience
- Log `SUPABASE_SERVICE_ROLE_KEY`, session tokens, or user emails at `debug` in production
- Add secrets to `draft.json`, seeds, or skill examples
- Grant CI/review agents broad org secrets

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [OWASP — Secure coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP — Secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
