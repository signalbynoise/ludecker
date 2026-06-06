#!/usr/bin/env node
/** Thin wrapper — SSOT: packages/aaac/src/generators/generate-commands.mjs */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const script = path.join(repoRoot, "packages/aaac/src/generators/generate-commands.mjs");
const cursorRoot = path.join(repoRoot, ".cursor");

const result = spawnSync(process.execPath, [script, "--root", cursorRoot], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
