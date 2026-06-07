---
name: release-app-orchestrator
description: >-
  Orchestrates release-app with phased expert subagents: preflight, git (blocking),
  Render deploy poll (mandatory), verify, report.
disable-model-invocation: true
---

# release-app orchestrator

## Parse

- **Domain:** `production` (default) or environment token
- **Intent:** quoted ship notes (optional) — e.g. `"Ship with tests"`

## Load

1. [../SKILL.md](../SKILL.md) — swarm DAG
2. [ship-procedure.md](../ship-procedure.md) — step reference (mandatory Render poll)
3. [graph.yaml](../../../../aaac/graph.yaml) — `release-app`
4. [ludecker-infrastructure](../../../ludecker/infrastructure/SKILL.md)

## Phases (all mandatory unless noted)

### 0. Preflight

**Always** run before git:

```bash
pnpm typecheck
```

If intent includes `with tests` / `test`: run additional tests per [testing](../../testing/SKILL.md).

On failure → **STOP**. No commit.

### 1. Wave 1 — Git (blocking)

Execute [agents/release-git.md](../../../../agents/release-git.md) procedure (or spawn shell subagent).

If nothing to commit: still record current `HEAD` as `commit_sha` and verify it matches `origin/main`.

**Do not** start Wave 1.5 or Wave 2 until `commit_sha` is known and pushed (or already on remote).

### 1.5. Wave 1.5 — AAAC (conditional, blocking when triggered)

Execute [agents/release-aaac.md](../../../../agents/release-aaac.md):

1. `detect-aaac-changes.mjs --commit-sha <sha>`
2. When `needs_publish`: run ship checks, push `aaac-v{version}` tag, `watch-aaac-publish.mjs`, then `sync-quick-start-aaac-version.mjs`

**Ship fails** if AAAC wave is triggered and checks or npm monitoring fail.

When skipped, record `aaac_publish_skipped: true`.

### 2. Wave 2 — Render (blocking)

Execute [agents/release-render.md](../../../../agents/release-render.md):

- MCP `user-render` with workspace bootstrap, **or**
- `watch-render-deploy.mjs --commit-sha <sha>` when `RENDER_API_KEY` set

Poll until `live` or terminal failure. Fetch logs on failure.

**Ship fails** if Wave 2 does not return `status: live` and smoke **200**.

### 3. Verify + report

- [verification](../../verification/SKILL.md): deploy commit matches push; site returns 200
- [reporting](../../reporting/SKILL.md): table with preflight, git SHA, deploy id/status, smoke code

## Anti-patterns

- Stopping after push ("should be building")
- Skipping Render poll when MCP workspace unset (bootstrap workspace first)
- Skipping preflight typecheck
- Using `plugin-render-render` MCP
- Force-pushing `main`
