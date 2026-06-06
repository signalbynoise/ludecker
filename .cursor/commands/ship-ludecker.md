# ship-ludecker

Ship Lüdecker to production — alias for `/release-app`.

## Syntax

```text
/ship-ludecker [production] ["optional intent"]
/release-app [production] ["optional intent"]
```

## What runs (mandatory)

| Wave | Step | Blocking |
|------|------|----------|
| 0 | `pnpm typecheck` | yes |
| 1 | Git commit + push to `main` | yes |
| 2 | Render poll `ludecker-website` until `live` or fail + logs | yes |
| 3 | Smoke `https://ludecker-website.onrender.com/` → 200 | yes |
| 4 | Report | — |

Ship **fails** if Wave 2 is skipped or ends with "should be building".

## Dispatch

1. [.cursor/aaac/dispatch.md](../aaac/dispatch.md)
2. [.cursor/aaac/graph.yaml](../aaac/graph.yaml) — **`release-app`** (alias `ship-ludecker`)
3. [platform-release/orchestrator](../skills/shared/platform-release/orchestrator/SKILL.md)
4. Procedure: [ship-procedure.md](../skills/shared/platform-release/ship-procedure.md)

## Render monitoring

- MCP: `user-render` — workspace Erik (`tea-csp7qr3gbbvc73d1fvqg`)
- Script: `node .cursor/skills/shared/platform-release/scripts/watch-render-deploy.mjs --commit-sha <sha>`

## Examples

```text
/ship-ludecker
/ship-ludecker production "Ship docs shell"
/release-app production "with tests"
```
