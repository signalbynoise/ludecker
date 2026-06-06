---
name: shared-platform-release
description: >-
  Phased release for release-app: mandatory preflight, git, Render poll, verify, report.
disable-model-invocation: true
---

# Shared platform release

## Swarm DAG

```text
Wave 0: pnpm typecheck (mandatory)
  ↓
Wave 1: release-git  ← BLOCKING
  ↓
Wave 1.5: release-aaac ← CONDITIONAL (blocking when AAAC changes detected)
  ↓
Wave 2: release-render ← BLOCKING (poll until live or fail)
  ↓
Wave 3: verification + reporting
```

## Wave 0 — preflight

```bash
pnpm typecheck
```

Always. Optional extra tests when intent requests them.

## Wave 1 — git

Execute [agents/release-git.md](../../../agents/release-git.md) or spawn shell subagent.

## Wave 1.5 — AAAC (conditional)

Execute [agents/release-aaac.md](../../../agents/release-aaac.md) when `detect-aaac-changes.mjs` reports `needs_publish: true`.

Scripts: [scripts/detect-aaac-changes.mjs](scripts/detect-aaac-changes.mjs), [scripts/run-aaac-ship-checks.mjs](scripts/run-aaac-ship-checks.mjs), [scripts/watch-aaac-publish.mjs](scripts/watch-aaac-publish.mjs).

## Wave 2 — Render (mandatory)

Execute [agents/release-render.md](../../../agents/release-render.md).

Tools: `user-render` MCP (workspace `tea-csp7qr3gbbvc73d1fvqg`) or [scripts/watch-render-deploy.mjs](scripts/watch-render-deploy.mjs).

**Never** end ship without polled deploy status.

## Reference

Full steps: [ship-procedure.md](ship-procedure.md)
