#!/usr/bin/env node
/**
 * Convert all CMS content rows from editorial prefixes (C:, P1:, …) to markdown.
 * Usage: node apps/website/scripts/migrate-editorial-content.mjs [--dry-run]
 */

import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const require = createRequire(resolve(REPO_ROOT, "apps/website/package.json"));
const { createClient } = require("@supabase/supabase-js");

const EDITORIAL_LINE = /^([A-Z]+\d*:|FS:|R:)\s*(.*)$/;

function convertEditorialLineToMarkdown(line) {
  const trimmed = line.trim();
  const match = trimmed.match(EDITORIAL_LINE);
  if (!match?.[1]) {
    return line;
  }

  const prefix = match[1];
  const body = match[2] ?? "";

  if (prefix === "C:") {
    return `## ${body}`;
  }

  if (prefix === "R:") {
    return body.length > 0 ? `## ${body}` : "## Sources";
  }

  if (/^G\d+:$/.test(prefix)) {
    return `### ${body.length > 0 ? body : prefix.replace(/:$/, "")}`;
  }

  if (/^P\d+:$/.test(prefix)) {
    return body;
  }

  if (prefix === "FS:") {
    return body;
  }

  return body.length > 0 ? body : trimmed;
}

function convertEditorialContentToMarkdown(content) {
  return content.split("\n").map(convertEditorialLineToMarkdown).join("\n");
}

function contentUsesEditorialPrefixes(content) {
  return content.split("\n").some((line) => EDITORIAL_LINE.test(line.trim()));
}

const ENV_PATH = resolve(REPO_ROOT, "apps/website/.env.local");
const CONTENT_TABLE = "content";

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

const dryRun = process.argv.includes("--dry-run");
const env = loadEnvFile(ENV_PATH);
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("[error] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const { data: rows, error } = await supabase
  .from(CONTENT_TABLE)
  .select("id, slug, content");

if (error) {
  console.error("[error] fetch failed:", error.message);
  process.exit(1);
}

let updated = 0;

for (const row of rows ?? []) {
  if (!contentUsesEditorialPrefixes(row.content ?? "")) {
    continue;
  }

  const next = convertEditorialContentToMarkdown(row.content);
  console.log(`[migrate] ${row.slug}`);

  if (dryRun) {
    updated += 1;
    continue;
  }

  const { error: updateError } = await supabase
    .from(CONTENT_TABLE)
    .update({ content: next })
    .eq("id", row.id);

  if (updateError) {
    console.error(`[error] ${row.slug}:`, updateError.message);
    process.exit(1);
  }

  updated += 1;
}

console.log(
  dryRun
    ? `[dry-run] Would update ${updated} row(s)`
    : `[done] Updated ${updated} row(s)`,
);
