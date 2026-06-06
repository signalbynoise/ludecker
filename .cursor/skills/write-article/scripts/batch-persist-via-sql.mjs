#!/usr/bin/env node
/**
 * Output SQL UPSERT statements for draft.json files (for MCP execute_sql).
 * Usage: node batch-persist-via-sql.mjs slug1 slug2 ...
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUNS = resolve(__dirname, "../../../write-article-runs");

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sqlEscape(str) {
  return String(str ?? "").replace(/'/g, "''");
}

function upsertSql(draft) {
  const now = new Date().toISOString();
  const publishedAt = draft.status === "published" ? now : null;
  return `
INSERT INTO public.content (
  title, slug, excerpt, content, status, article_type,
  cover_image, seo_title, seo_description, featured,
  published_at, updated_at
) VALUES (
  '${sqlEscape(draft.title)}',
  '${sqlEscape(draft.slug)}',
  ${draft.excerpt ? `'${sqlEscape(draft.excerpt)}'` : "NULL"},
  '${sqlEscape(draft.content)}',
  '${sqlEscape(draft.status)}'::public.content_status,
  '${sqlEscape(draft.article_type)}'::public.article_type,
  NULL,
  ${draft.seo_title ? `'${sqlEscape(draft.seo_title)}'` : "NULL"},
  ${draft.seo_description ? `'${sqlEscape(draft.seo_description)}'` : "NULL"},
  ${draft.featured ? "true" : "false"},
  ${publishedAt ? `'${publishedAt}'` : "NULL"},
  '${now}'
)
ON CONFLICT (article_type, slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  published_at = EXCLUDED.published_at,
  updated_at = EXCLUDED.updated_at;
`.trim();
}

const slugs = process.argv.slice(2);
const targets =
  slugs.length > 0
    ? slugs
    : readdirSync(RUNS).filter((d) =>
        existsSync(resolve(RUNS, d, "draft.json")),
      );

for (const slug of targets) {
  const path = resolve(RUNS, slug, "draft.json");
  if (!existsSync(path)) {
    console.error(`[skip] no draft: ${path}`);
    continue;
  }
  const draft = JSON.parse(readFileSync(path, "utf8"));
  draft.slug = slugify(draft.slug ?? draft.title);
  console.log(`-- ${draft.title} (${draft.slug})`);
  console.log(upsertSql(draft));
  console.log("");
}
