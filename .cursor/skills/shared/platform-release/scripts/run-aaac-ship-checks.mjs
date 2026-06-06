#!/usr/bin/env node
/**
 * Pre-tag AAAC checks for ship Wave 1.5.
 * SSOT: ship-procedure.md § AAAC checks
 *
 * Usage:
 *   node run-aaac-ship-checks.mjs [--smoke-dir /tmp/aaac-smoke-ship]
 *
 * Exit 0 on pass; non-zero on failure.
 */

import { execSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../../../..");

function parseArgs(argv) {
  let smokeDir = null;
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--smoke-dir" && argv[i + 1]) smokeDir = argv[++i];
  }
  return { smokeDir };
}

function run(cmd, label) {
  console.log(`[info] ${label}: ${cmd}`);
  execSync(cmd, { cwd: REPO_ROOT, stdio: "inherit" });
}

function main() {
  const { smokeDir } = parseArgs(process.argv);
  const dir =
    smokeDir ?? mkdtempSync(join(tmpdir(), "aaac-smoke-ship-"));

  run("pnpm --filter @ludecker/aaac test", "vitest");
  run(
    `node packages/aaac/src/cli.mjs init --yes --dir ${dir}`,
    "init smoke",
  );
  run("pnpm aaac:generate", "aaac:generate");

  try {
    execSync(
      "git diff --exit-code .cursor/aaac/graph.yaml .cursor/commands/",
      { cwd: REPO_ROOT, stdio: "inherit" },
    );
  } catch {
    console.error(
      "[error] aaac:generate produced diff in graph.yaml or commands — commit or fix generators first",
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify({
      status: "passed",
      smoke_dir: dir,
      checks: ["vitest", "init_smoke", "aaac_generate_diff_clean"],
    }),
  );
}

main();
