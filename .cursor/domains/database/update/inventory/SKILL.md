---
name: database-inventory
description: >-
  Supabase PostgreSQL schema, RLS, migrations, seeds, and type mirrors for
  Lüdecker content model.
argument-hint: "<change description or path under supabase/ or content types>"
effort: medium
disable-model-invocation: true
---

# Lüdecker Database — Inventory

**Implementation:** [governance/implementation/SKILL.md](../../../skills/shared/governance/implementation/SKILL.md)

**Skills:** [ludecker/database-schema/SKILL.md](../../../skills/ludecker/database-schema/SKILL.md), [ludecker/security/SKILL.md](../../../skills/ludecker/security/SKILL.md)

**Docs:** [docs/content-model.md](../../../docs/content-model.md), [docs/deployment.md](../../../docs/deployment.md)

---

## 1. Module identity

| Field | Value |
|-------|-------|
| **Product name** | Lüdecker Database |
| **Technical slug** | `database` |
| **In one sentence** | Postgres content model with RLS, mirrored in TypeScript types and mappers. |
| **Out of scope** | Admin UI, public page rendering, design tokens |

---

## 2. Constraints (module-specific)

- **Migrations** — one file per change under `supabase/migrations/`; apply via Supabase MCP
- **RLS** — all public tables; published readable anonymously; drafts auth-only
- **Type mirror** — `packages/types/src/index.ts` after enum/column changes
- **Mapper** — `apps/website/lib/content/map-content.ts` at boundary
- **Project ref** — `anseivwusnyiwopihnqu`

**Tables:** `content`, `tags`, `content_tags` — see content-model doc

---

## 3. Module inventory (auto-maintained)

> **Last synced:** 2026-06-06

### Migrations

| File | Purpose |
|------|---------|
| `20250603120000_content_table.sql` | Core content table |
| `20250603130000_featured_and_storage.sql` | Featured flag, storage |
| `20250603180000_align_article_types.sql` | Article type enum |
| `20250603190000_section_pages.sql` | Section pages |
| `20250603200000_content_composite_slug.sql` | Composite slug |

### Code mirrors

| Path | Role |
|------|------|
| `packages/types/src/index.ts` | Shared types, NAV_ITEMS, enums |
| `apps/website/lib/content/map-content.ts` | Row → Content mapper |
| `apps/website/lib/content/types.ts` | Website content types |
| `supabase/seed/` | Sample content |

### Anti-patterns

- Schema change without migration
- Disabling RLS on content tables
- Service role key in client code
- Duplicate enum definitions outside `packages/types`
