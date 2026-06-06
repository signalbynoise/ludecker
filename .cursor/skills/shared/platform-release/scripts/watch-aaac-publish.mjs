#!/usr/bin/env node
/**
 * Poll npm registry until @ludecker/aaac version is published.
 * SSOT: ship-procedure.md § AAAC monitoring
 *
 * Usage:
 *   node watch-aaac-publish.mjs --version 1.1.0 [--timeout-min 10]
 *
 * Optional: gh CLI auth to also watch GitHub Actions workflow.
 * Exit 0 when version appears on registry; 1 on timeout/failure.
 */

const REGISTRY = "https://registry.npmjs.org/@ludecker%2Faaac";
const DEFAULT_TIMEOUT_MIN = 10;
const POLL_INTERVAL_MS = 15_000;

function parseArgs(argv) {
  const args = { version: null, timeoutMin: DEFAULT_TIMEOUT_MIN };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--version" && argv[i + 1]) args.version = argv[++i];
    else if (arg === "--timeout-min" && argv[i + 1]) {
      args.timeoutMin = Number(argv[++i]);
    }
  }
  if (!args.version) {
    console.error(
      "[error] --version required\nUsage: node watch-aaac-publish.mjs --version <semver>",
    );
    process.exit(1);
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRegistryVersion() {
  const res = await fetch(REGISTRY, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`registry fetch ${res.status}`);
  }
  const data = await res.json();
  return data?.versions ?? {};
}

async function versionPublished(target) {
  const versions = await fetchRegistryVersion();
  return Object.prototype.hasOwnProperty.call(versions, target);
}

async function watchGhWorkflow(tag, timeoutMin) {
  const { execSync } = await import("node:child_process");
  try {
    execSync("gh --version", { stdio: "ignore" });
  } catch {
    return { watched: false, reason: "gh_not_installed" };
  }

  const deadline = Date.now() + timeoutMin * 60_000;
  while (Date.now() < deadline) {
    try {
      const out = execSync(
        "gh run list --workflow=publish-aaac.yml --json status,conclusion,headBranch --limit 5",
        { encoding: "utf8" },
      );
      const runs = JSON.parse(out);
      const match = runs.find((r) => r.headBranch === tag);
      if (match?.status === "completed") {
        return {
          watched: true,
          status: match.status,
          conclusion: match.conclusion,
        };
      }
      console.log("[info] waiting for GitHub Actions publish-aaac workflow…");
    } catch (err) {
      console.log(`[warn] gh run list failed: ${err.message}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  return { watched: true, status: "timeout" };
}

async function main() {
  const { version, timeoutMin } = parseArgs(process.argv);
  const tag = `aaac-v${version}`;
  const deadline = Date.now() + timeoutMin * 60_000;

  console.log(
    `[info] watch-aaac-publish version=${version} tag=${tag} timeout=${timeoutMin}m`,
  );

  const gh = await watchGhWorkflow(tag, Math.min(timeoutMin, 5));

  while (Date.now() < deadline) {
    const published = await versionPublished(version);
    if (published) {
      console.log(
        JSON.stringify({
          status: "published",
          version,
          tag,
          registry_url: "https://www.npmjs.com/package/@ludecker/aaac",
          github_actions: gh,
        }),
      );
      process.exit(0);
    }
    console.log(`[info] waiting for npm @ludecker/aaac@${version}…`);
    await sleep(POLL_INTERVAL_MS);
  }

  console.log(
    JSON.stringify({
      status: "timeout",
      version,
      tag,
      github_actions: gh,
      hint: "Check GitHub Actions workflow publish-aaac.yml and NPM_TOKEN secret",
    }),
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("[error]", err.message);
  process.exit(1);
});
