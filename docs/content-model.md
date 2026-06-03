# Content Model

All CMS content is stored in Supabase PostgreSQL.

## Tables

### `content`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | TEXT | URL slug (unique) |
| `title` | TEXT | Display title |
| `excerpt` | TEXT | Short summary |
| `content` | TEXT | Body (structured text with `C:`, `P1:`, predicate blocks) |
| `status` | ENUM | `draft`, `published`, `archived` |
| `article_type` | ENUM | See content types below |
| `cover_image` | TEXT | Public URL from Supabase Storage |
| `seo_title` | TEXT | Override for `<title>` |
| `seo_description` | TEXT | Meta description |
| `featured` | BOOLEAN | Home page hero (pages only) |
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

| Type | Route prefix | List prefix |
|------|--------------|-------------|
| `article` | `/articles`, `/article/[slug]` | A{n}: |
| `essay` | `/essay/[slug]` | E{n}: |
| `note` | `/note/[slug]` | N{n}: |
| `tutorial` | `/tutorial/[slug]` | T{n}: |
| `guide` | `/guides`, `/guide/[slug]` | G{n}: |
| `project` | `/project/[slug]` | P{n}: |
| `page` | `/page/[slug]` | C: (home hero) |

## CMS capabilities

- Create, edit, delete content
- Draft / publish / unpublish / archive
- Tag management (create on the fly)
- Article type selection
- Cover image upload to `content-images` bucket
- SEO metadata editing
- Featured flag for home page hero

## Content format

Body text uses lightweight conventions parsed by `ArticleBody`:

```
C: Section heading
P1: Paragraph label
Predicate form:
Type · article
Tags · tag-one, tag-two
```

## RLS policies

- **Public read**: published `content`, all `tags`, `content_tags` for published content
- **Authenticated**: full CRUD on all tables and storage uploads
