# Agent: release-render

**Wave 2 — runs after `release-git` succeeds.**

## Role

Monitor Render deploy for `ludecker-website` until `live` or report failure.

## Inputs

- `commit_sha` (required, from release-git)
- Service SSOT: `ludecker-website` from `render.yaml`

## Procedure

Follow [ship-procedure.md § Render](../skills/shared/platform-release/ship-procedure.md).

MCP: `user-render` only.

## Return

```yaml
status: live | build_failed | timeout
services: [{ name, serviceId, deployStatus, deployId }]
build_log_excerpt: string | null
smoke_http_code: number | null
evidence: MCP call summaries
```
