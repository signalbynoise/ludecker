# Content Model

All CMS content is stored in Supabase PostgreSQL.

## Tables

### `content`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | TEXT | URL slug (unique per `article_type`; section landings use `index`) |
| `title` | TEXT | Display title |
| `excerpt` | TEXT | Short summary |
| `content` | TEXT | Body (markdown: `##` headings, paragraphs, links) |
| `status` | ENUM | `draft`, `published`, `archived` |
| `article_type` | ENUM | See content types below |
| `cover_image` | TEXT | Public URL from Supabase Storage |
| `seo_title` | TEXT | Override for `<title>` |
| `seo_description` | TEXT | Meta description |
| `featured` | BOOLEAN | Home intro fallback (`home` type); forced true for `home`/`home` row |
| `created_at` | TIMESTAMPTZ | Created timestamp |
| `updated_at` | TIMESTAMPTZ | Last update (trigger) |
| `published_at` | TIMESTAMPTZ | Publish timestamp |

### `tags`

| Column | Type |
|--------|------|
| `id` | UUID |
| `name` | TEXT (unique) |
| `slug` | TEXT (unique) |
| `created_at` | TIMESTAMPTZ |

### `content_tags`

Many-to-many junction between `content` and `tags`.

## Content types (`article_type`)

**SSOT:** `packages/types/src/article-type.ts` (`ArticleType`, `ARTICLE_TYPES`, `NAV_ITEMS`) — mirrored in Postgres enum `public.article_type`.

There are **8** canonical types. **7** are listable nav sections; `home` is the Introduction page at `/` (not in main nav).

| Type | Public route | List prefix | Notes |
|------|--------------|-------------|-------|
| `home` | `/` (slug `home`) | — | Introduction page; not a listable section |
| `articles` | `/articles`, `/articles/[slug]` | AR{n}: | Section landing: `slug: index` |
| `guides` | `/guide`, `/guide/[slug]` | GU{n}: | Section landing: `slug: index`; nav href `/guide` (singular) |
| `skills` | `/skills`, `/skills/[slug]` | SK{n}: | Section landing: `slug: index`; body stores full `SKILL.md` |
| `tools` | `/tools`, `/tools/[slug]` | TO{n}: | Section landing: `slug: index` |
| `commands` | `/commands`, `/commands/[slug]` | CO{n}: | Section landing: `slug: index` |
| `subagents` | `/subagents`, `/subagents/[slug]` | SU{n}: | Section landing: `slug: index` |
| `diagrams` | `/diagrams`, `/diagrams/[slug]` | DI{n}: | Section landing: `slug: index` |

List prefixes come from `getArticlePrefix` in `packages/utils` (first two letters of the type name, uppercased). Section landings resolve to the nav href, not `/{type}/index`.

## CMS capabilities

- Create, edit, delete content
- Draft / publish / unpublish / archive
- Tag management (create on the fly)
- Article type selection (all 8 types from `ARTICLE_TYPES`)
- Section landing pages (`slug: index` per listable type)
- Home intro row (`article_type: home`, `slug: home` at `/`)
- Cover image upload to `content-images` bucket
- SEO metadata editing
- Featured flag for home intro fallback

## Content format

Body text is markdown parsed by `ArticleBody`. Use `##` for section headings (table of contents), `###` for subsections, blank lines between paragraphs, and `[anchor](https://…)` for outbound links. Write in plain, everyday language; see `.cursor/skills/write-article/frameworks/_voice.md`.

```markdown
## Section heading (plain-language headline)

Short paragraph with an inline [outbound link](https://example.com).

## Sources

[Author — Title](https://example.com) — one-line citation.
```

`article_type`, `status`, and tags are stored on the content row and in the admin form — not in the body text.

Outbound links use markdown syntax `[anchor](https://…)` inside paragraph blocks.
`ArticleInlineText` renders them as external anchors (`target="_blank"`,
`rel="noopener noreferrer"`). Parsing lives in `packages/utils/src/content-links.ts`.

Do not use `*` or `**` for emphasis in CMS body prose — bold and italic are not
rendered. Use headings and plain sentences instead. Fenced code blocks may contain
asterisks (for example glob patterns). `article_type: skills` stores full
`SKILL.md` files and is exempt from this rule.

### Diagram articles (`article_type: diagrams`)

**Editorial intent:** universal, topic-first pieces (e.g. how state machines work) with
**one** Mermaid diagram as the main content — not Lüdecker architecture or repo maps.
See `.cursor/skills/write-article/frameworks/diagrams.md`.

Body includes a single fenced Mermaid block. `ArticleBody` with
`articleType="diagrams"` renders it via `ArticleMermaidDiagram` and
`packages/ui/src/mermaid-config.ts`.

## RLS policies

- **Public read**: published `content`, all `tags`, `content_tags` for published content
- **Authenticated**: full CRUD on all tables and storage uploads
