#!/usr/bin/env node
/**
 * Poll Render until deploy for commit_sha is live or failed.
 * SSOT: ship-procedure.md § Render monitoring
 *
 * Usage:
 *   node watch-render-deploy.mjs --commit-sha <sha> [--service ludecker-website] [--timeout-min 15]
 *
 * Env: RENDER_API_KEY (from Render Dashboard → Account Settings → API Keys)
 * Fallback: parent agent uses user-render MCP per ship-procedure.md
 */

const RENDER_API = "https://api.render.com/v1";
const DEFAULT_SERVICE = "ludecker-website";
const DEFAULT_TIMEOUT_MIN = 15;
const POLL_INTERVAL_MS = 30_000;
const TERMINAL_FAIL = new Set(["build_failed", "update_failed", "canceled"]);

function parseArgs(argv) {
  const args = {
    commitSha: null,
    service: DEFAULT_SERVICE,
    timeoutMin: DEFAULT_TIMEOUT_MIN,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--commit-sha" && argv[i + 1]) args.commitSha = argv[++i];
    else if (arg === "--service" && argv[i + 1]) args.service = argv[++i];
    else if (arg === "--timeout-min" && argv[i + 1]) {
      args.timeoutMin = Number(argv[++i]);
    }
  }
  if (!args.commitSha) {
    console.error(
      "[error] --commit-sha required\nUsage: node watch-render-deploy.mjs --commit-sha <sha>",
    );
    process.exit(1);
  }
  return args;
}

async function renderFetch(apiKey, path) {
  const res = await fetch(`${RENDER_API}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Render API ${path} → ${res.status}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

async function findServiceId(apiKey, serviceName) {
  const data = await renderFetch(apiKey, "/services?limit=100");
  const match = (data ?? []).find((s) => s.service?.name === serviceName);
  if (!match) {
    throw new Error(`Service not found: ${serviceName}`);
  }
  return match.service.id;
}

function commitMatches(deployCommitId, targetSha) {
  if (!deployCommitId || !targetSha) return false;
  return (
    deployCommitId === targetSha ||
    deployCommitId.startsWith(targetSha) ||
    targetSha.startsWith(deployCommitId)
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function smokeCheck(url) {
  const res = await fetch(url, { method: "GET" });
  return res.status;
}

async function main() {
  const { commitSha, service, timeoutMin } = parseArgs(process.argv);
  const apiKey = process.env.RENDER_API_KEY;

  if (!apiKey) {
    console.error(
      "[error] RENDER_API_KEY not set. Use user-render MCP per ship-procedure.md,",
    );
    console.error("or export RENDER_API_KEY from Render Dashboard → API Keys.");
    process.exit(2);
  }

  console.log(
    `[info] watch-render-deploy service=${service} commit=${commitSha.slice(0, 12)} timeout=${timeoutMin}m`,
  );

  const serviceId = await findServiceId(apiKey, service);
  const deadline = Date.now() + timeoutMin * 60_000;
  let lastStatus = null;
  let deployId = null;

  while Date.now() < deadline) {
    const data = await renderFetch(
      apiKey,
      `/services/${serviceId}/deploys?limit=10`,
    );
    const deploys = data ?? [];
    const match = deploys.find((d) =>
      commitMatches(d.deploy?.commit?.id, commitSha),
    );

    if (!match) {
      console.log("[info] waiting for deploy row matching commit…");
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    const deploy = match.deploy;
    deployId = deploy.id;
    lastStatus = deploy.status;
    console.log(
      `[info] deploy=${deployId} status=${lastStatus} trigger=${deploy.trigger ?? "?"}`,
    );

    if (lastStatus === "live") {
      const smokeUrl = "https://ludecker-website.onrender.com/";
      const httpCode = await smokeCheck(smokeUrl);
      console.log(
        JSON.stringify({
          status: "live",
          serviceId,
          deployId,
          commitSha: deploy.commit?.id,
          smoke_http_code: httpCode,
          smoke_url: smokeUrl,
        }),
      );
      process.exit(httpCode === 200 ? 0 : 3);
    }

    if (TERMINAL_FAIL.has(lastStatus)) {
      console.log(
        JSON.stringify({
          status: lastStatus,
          serviceId,
          deployId,
          commitSha: deploy.commit?.id,
          dashboardUrl: `https://dashboard.render.com/web/${serviceId}`,
        }),
      );
      process.exit(1);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  console.log(
    JSON.stringify({
      status: "timeout",
      serviceId,
      deployId,
      lastStatus,
      commitSha,
    }),
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("[error]", err.message);
  process.exit(1);
});
