#!/usr/bin/env node
/**
 * Detect whether @ludecker/aaac needs publish for a ship commit.
 * SSOT: ship-procedure.md § AAAC (Wave 1.5)
 *
 * Usage:
 *   node detect-aaac-changes.mjs --commit-sha <sha>
 *   node detect-aaac-changes.mjs --since-tag   # compare last aaac-v* tag..HEAD
 *
 * Exit 0 always; JSON on stdout. needs_publish=true → ship must run release-aaac wave.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../../../..");

const PACKAGE_JSON = join(REPO_ROOT, "packages/aaac/package.json");

const TARBALL_PATHS = ["packages/aaac/"];

const DOGFOOD_PATHS = [
  ".cursor/skills/shared/",
  ".cursor/hooks/",
  ".cursor/hooks.json",
  ".cursor/aaac/dispatch.md",
  ".cursor/aaac/enforcement.json",
  ".cursor/aaac/complexity.yaml",
  ".cursor/aaac/contracts/",
  ".cursor/aaac/governance/",
  ".cursor/aaac/lifecycle/",
  ".cursor/aaac/run/",
  ".cursor/aaac/scripts/",
  ".cursor/rules/aaac-enforcement.mdc",
  ".github/workflows/publish-aaac.yml",
];

function parseArgs(argv) {
  const args = { commitSha: null, sinceTag: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--commit-sha" && argv[i + 1]) args.commitSha = argv[++i];
    else if (arg === "--since-tag") args.sinceTag = true;
  }
  return args;
}

function git(args, { allowEmpty = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (err) {
    if (allowEmpty) return "";
    throw err;
  }
}

function lastAaacTag() {
  return git(
    ["describe", "--tags", "--match", "aaac-v*", "--abbrev=0"],
    { allowEmpty: true },
  );
}

function parseTagVersion(tag) {
  const m = /^aaac-v(.+)$/.exec(tag ?? "");
  return m ? m[1] : null;
}

function readPackageVersion() {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf8"));
  return pkg.version;
}

function versionGreater(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return true;
    if (da < db) return false;
  }
  return false;
}

function diffNames(range, paths) {
  if (!range) return [];
  const out = git(["diff", "--name-only", range, "--", ...paths], {
    allowEmpty: true,
  });
  return out ? out.split("\n").filter(Boolean) : [];
}

function commitTouchesPaths(sha, paths) {
  const out = git(["diff-tree", "--no-commit-id", "--name-only", "-r", sha], {
    allowEmpty: true,
  });
  const names = out ? out.split("\n").filter(Boolean) : [];
  return names.filter((n) =>
    paths.some((p) => (p.endsWith("/") ? n.startsWith(p) : n === p || n.startsWith(`${p}/`))),
  );
}

function main() {
  const { commitSha, sinceTag } = parseArgs(process.argv);
  const packageVersion = readPackageVersion();
  const lastTag = lastAaacTag();
  const lastTagVersion = parseTagVersion(lastTag);

  let changedPaths = [];
  let range = null;

  if (commitSha) {
    const tarball = commitTouchesPaths(commitSha, TARBALL_PATHS);
    const dogfood = commitTouchesPaths(commitSha, DOGFOOD_PATHS);
    changedPaths = [...new Set([...tarball, ...dogfood])];
  } else if (sinceTag) {
    range = lastTag ? `${lastTag}..HEAD` : "HEAD";
    const tarball = diffNames(range, TARBALL_PATHS);
    const dogfood = diffNames(range, DOGFOOD_PATHS);
    changedPaths = [...new Set([...tarball, ...dogfood])];
  } else {
    console.error(
      "[error] --commit-sha or --since-tag required\nUsage: node detect-aaac-changes.mjs --commit-sha <sha>",
    );
    process.exit(1);
  }

  const versionPending =
    lastTagVersion != null && versionGreater(packageVersion, lastTagVersion);

  const needsPublish = changedPaths.length > 0 || versionPending;

  const reasons = [];
  if (changedPaths.length > 0) reasons.push("aaac_paths_changed");
  if (versionPending) reasons.push("version_ahead_of_last_tag");

  const result = {
    needs_publish: needsPublish,
    reasons,
    package_version: packageVersion,
    last_tag: lastTag || null,
    last_tag_version: lastTagVersion,
    changed_paths: changedPaths,
    commit_sha: commitSha ?? null,
    diff_range: range,
    tag_to_push: needsPublish ? `aaac-v${packageVersion}` : null,
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
