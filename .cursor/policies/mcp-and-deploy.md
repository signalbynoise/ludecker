# Policy: MCP and deploy

Summaries — full rules in [.cursor/rules/](../rules/):

| Rule file | Governs |
|-----------|---------|
| [supabase-mcp.mdc](../rules/supabase-mcp.mdc) | Supabase MCP migrations, project ref, RLS |
| [deploy.mdc](../rules/deploy.mdc) | Render `ludecker-website`, `render.yaml` blueprint |

Supabase migrations: apply via MCP immediately after adding SQL under `supabase/migrations/`.

Render deploy checks: MCP `user-render` only (not `plugin-render-render`).
