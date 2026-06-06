# Agent: release-render

**Wave 2 — mandatory.** Runs after `release-git` succeeds. Parent must not report ship complete until this agent returns.

## Role

Monitor Render deploy for `ludecker-website` until `live` or report failure with logs.

## Inputs

- `commit_sha` (required, from release-git)
- Service SSOT: `ludecker-website` from `render.yaml`

## Procedure

Follow [ship-procedure.md § Render](../skills/shared/platform-release/ship-procedure.md).

### MCP bootstrap (`user-render`)

1. `get_selected_workspace` — if unset, `select_workspace` owner ID `tea-csp7qr3gbbvc73d1fvqg` (Erik workspace)
2. `list_services` → service id for `ludecker-website`
3. Poll `list_deploys` every **30s**, max **15 min**, for deploy matching `commit_sha`
4. On `build_failed` / `update_failed`: `list_logs` → excerpt in return payload
5. Smoke: curl production URL — expect **200**

### CLI fallback

If MCP unavailable and `RENDER_API_KEY` is set:

```bash
node .cursor/skills/shared/platform-release/scripts/watch-render-deploy.mjs --commit-sha <sha>
```

## Return

```yaml
status: live | build_failed | timeout
services:
  - name: ludecker-website
    serviceId: string
    deployStatus: string
    deployId: string
commit_sha: string
build_log_excerpt: string | null
smoke_http_code: number
smoke_url: https://ludecker-website.onrender.com/
evidence: MCP call summaries or script JSON output
```

## Rules

- Never skip polling because push "should trigger" a deploy
- Never report success without `status: live` and smoke **200**
- On timeout: return `status: timeout` with last known deploy status
