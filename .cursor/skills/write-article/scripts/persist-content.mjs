#!/usr/bin/env node
/**
 * Persist CMS draft.json to Supabase (service role).
 * Usage: node persist-content.mjs --file path/to/draft.json [--update] [--publish]
 */

import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../..");
const require = createRequire(
  resolve(REPO_ROOT, "apps/website/package.json"),
);
const { createClient } = require("@supabase/supabase-js");
const ENV_PATH = resolve(REPO_ROOT, "apps/website/.env.local");
const CONTENT_TABLE = "content";

const ARTICLE_TYPE_ALIASES = {
  article: "articles",
  articles: "articles",
  guide: "guides",
  guides: "guides",
  skill: "skills",
  skills: "skills",
  tool: "tools",
  tools: "tools",
  command: "commands",
  commands: "commands",
  subagent: "subagents",
  subagents: "subagents",
  diagram: "diagrams",
  diagrams: "diagrams",
  home: "home",
};

function loadEnvFile(path) {
  if (!existsSync(path)) {
    console.error(`[error] Missing env file: ${path}`);
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseArgs(argv) {
  const args = { file: null, update: false, publish: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--update") args.update = true;
    else if (arg === "--publish") args.publish = true;
    else if (arg === "--file" && argv[i + 1]) {
      args.file = argv[++i];
    }
  }
  return args;
}

function normalizeDraft(raw, publishFlag) {
  const articleType =
    ARTICLE_TYPE_ALIASES[raw.article_type] ?? raw.article_type;
  if (!articleType || articleType === "home") {
    throw new Error(`Invalid article_type: ${raw.article_type}`);
  }

  const title = String(raw.title ?? "").trim();
  const slug = slugify(String(raw.slug ?? title));
  const content = String(raw.content ?? "").trim();

  if (!title) throw new Error("title is required");
  if (!slug) throw new Error("slug is required");
  if (!content) throw new Error("content is required");

  const status = publishFlag ? "published" : (raw.status ?? "draft");

  return {
    title,
    slug,
    excerpt: (raw.excerpt ?? "").trim() || null,
    content,
    status,
    article_type: articleType,
    cover_image: (raw.cover_image ?? "").trim() || null,
    seo_title: (raw.seo_title ?? "").trim() || null,
    seo_description: (raw.seo_description ?? "").trim() || null,
    featured: Boolean(raw.featured),
    published_at:
      status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    tagNames: Array.isArray(raw.tagNames)
      ? raw.tagNames.map((t) => String(t).trim()).filter(Boolean)
      : [],
  };
}

async function syncTags(supabase, contentId, tagNames) {
  if (tagNames.length === 0) return;

  const tagIds = [];
  for (const name of tagNames) {
    const slug = slugify(name);
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing?.id) {
      tagIds.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabase
      .from("tags")
      .insert({ name, slug })
      .select("id")
      .single();

    if (error) throw new Error(`tag insert failed: ${error.message}`);
    tagIds.push(created.id);
  }

  await supabase.from("content_tags").delete().eq("content_id", contentId);

  if (tagIds.length > 0) {
    const { error: linkError } = await supabase.from("content_tags").insert(
      tagIds.map((tag_id) => ({ content_id: contentId, tag_id })),
    );
    if (linkError) throw new Error(`content_tags failed: ${linkError.message}`);
  }
}

async function triggerProductionRevalidation(env, row) {
  if (row.status !== "published") {
    console.log(
      "[info] Live site unchanged (draft). Pass --publish to show on production.",
    );
    return;
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const secret = env.REVALIDATE_SECRET;
  if (!siteUrl || !secret) {
    console.warn(
      "[warn] Set NEXT_PUBLIC_SITE_URL and REVALIDATE_SECRET in apps/website/.env.local to refresh production after publish.",
    );
    return;
  }

  const endpoint = `${siteUrl}/api/revalidate`;
  console.log(`[info] Revalidating production cache: ${endpoint}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      article_type: row.article_type,
      slug: row.slug,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.warn(
      `[warn] Revalidation failed (${response.status}): ${text.slice(0, 200)}`,
    );
    return;
  }

  const payload = await response.json();
  console.log(`[info] Production cache refreshed`, JSON.stringify(payload));
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.file) {
    console.error(
      "Usage: node persist-content.mjs --file draft.json [--update] [--publish]",
    );
    process.exit(1);
  }

  const env = loadEnvFile(ENV_PATH);
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "[error] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in apps/website/.env.local",
    );
    process.exit(1);
  }

  const draftPath = resolve(process.cwd(), args.file);
  const raw = JSON.parse(readFileSync(draftPath, "utf8"));
  const row = normalizeDraft(raw, args.publish);

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing } = await supabase
    .from(CONTENT_TABLE)
    .select("id")
    .eq("article_type", row.article_type)
    .eq("slug", row.slug)
    .maybeSingle();

  let contentId;

  if (existing?.id) {
    if (!args.update) {
      console.error(
        `[error] Row exists (${row.article_type}/${row.slug}). Pass --update to overwrite.`,
      );
      process.exit(1);
    }
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .update(row)
      .eq("id", existing.id)
      .select("id, article_type, slug, status")
      .single();
    if (error) {
      console.error(`[error] update failed: ${error.message}`);
      process.exit(1);
    }
    contentId = data.id;
    console.log(JSON.stringify({ action: "updated", ...data }, null, 2));
  } else {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .insert(row)
      .select("id, article_type, slug, status")
      .single();
    if (error) {
      console.error(`[error] insert failed: ${error.message}`);
      process.exit(1);
    }
    contentId = data.id;
    console.log(JSON.stringify({ action: "inserted", ...data }, null, 2));
  }

  await syncTags(supabase, contentId, row.tagNames);

  const persisted = {
    article_type: row.article_type,
    slug: row.slug,
    status: row.status,
  };
  await triggerProductionRevalidation(env, persisted);
}

main().catch((err) => {
  console.error(`[error] ${err.message}`);
  process.exit(1);
});
