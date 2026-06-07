#!/usr/bin/env node
/**
 * Sync pinned @ludecker/aaac semver in the Quick Start CMS guide after npm publish.
 * SSOT: ship-procedure.md § AAAC — step after watch-aaac-publish
 *
 * Usage:
 *   node sync-quick-start-aaac-version.mjs --version 1.1.1
 *   node sync-quick-start-aaac-version.mjs   # reads packages/aaac/package.json
 */

import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../../../..");
const ENV_PATH = resolve(REPO_ROOT, "apps/website/.env.local");
const PACKAGE_JSON = join(REPO_ROOT, "packages/aaac/package.json");
const CONTENT_TABLE = "content";

const QUICK_START = {
  articleType: "guides",
  slug: "quick-start-npx-ludecker-aaac-latest-init",
};

/** Keep in sync with packages/utils/src/aaac-guide-version.ts */
const AAAC_VERSION_PIN_PATTERN =
  /@ludecker\/aaac@(?!latest)(\d+\.\d+\.\d+)/g;

function replaceAaacPackageVersionPins(content, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Invalid AAAC semver: ${version}`);
  }
  return content.replace(
    AAAC_VERSION_PIN_PATTERN,
    `@ludecker/aaac@${version}`,
  );
}

function quickStartGuideNeedsAaacVersionSync(content, version) {
  return replaceAaacPackageVersionPins(content, version) !== content;
}

const require = createRequire(
  resolve(REPO_ROOT, "apps/website/package.json"),
);

function parseArgs(argv) {
  const args = { version: null, dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--version" && argv[i + 1]) args.version = argv[++i];
    else if (arg === "--dry-run") args.dryRun = true;
  }
  return args;
}

function loadEnvFile(path) {
  if (!existsSync(path)) {
    throw new Error(`Missing env file: ${path}`);
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

function readPackageVersion() {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf8"));
  return pkg.version;
}

async function postRevalidate(siteUrl, secret, row) {
  const endpoint = `${siteUrl.replace(/\/$/, "")}/api/revalidate`;
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
    throw new Error(
      `Revalidation failed (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  return response.json();
}

async function main() {
  const args = parseArgs(process.argv);
  const version = args.version ?? readPackageVersion();

  const env = loadEnvFile(ENV_PATH);
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in apps/website/.env.local",
    );
  }

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: row, error: fetchError } = await supabase
    .from(CONTENT_TABLE)
    .select("id, content, status, slug, article_type")
    .eq("article_type", QUICK_START.articleType)
    .eq("slug", QUICK_START.slug)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`fetch failed: ${fetchError.message}`);
  }
  if (!row?.id) {
    throw new Error(
      `Quick Start guide not found (${QUICK_START.articleType}/${QUICK_START.slug})`,
    );
  }

  if (!quickStartGuideNeedsAaacVersionSync(row.content, version)) {
    console.log(
      JSON.stringify({
        status: "skipped",
        reason: "already_synced",
        version,
        slug: row.slug,
      }),
    );
    return;
  }

  const content = replaceAaacPackageVersionPins(row.content, version);

  if (args.dryRun) {
    console.log(
      JSON.stringify({
        status: "dry_run",
        version,
        slug: row.slug,
        content_preview: content.slice(-400),
      }),
    );
    return;
  }

  const { error: updateError } = await supabase
    .from(CONTENT_TABLE)
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  if (updateError) {
    throw new Error(`update failed: ${updateError.message}`);
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const secret = env.REVALIDATE_SECRET;
  let revalidated = false;

  if (row.status === "published" && siteUrl && secret) {
    await postRevalidate(siteUrl, secret, {
      article_type: row.article_type,
      slug: row.slug,
    });
    revalidated = true;
  }

  console.log(
    JSON.stringify({
      status: "updated",
      version,
      slug: row.slug,
      revalidated,
    }),
  );
}

main().catch((err) => {
  console.error(`[error] ${err.message}`);
  process.exit(1);
});
