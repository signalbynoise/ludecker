# Release ship procedure (reference)

Canonical steps for `/ship-ludecker` and `/release-app`. Subagents in `agents/release-*.md` own each slice.

## SSOT (Lüdecker)

| Fact | Value |
|------|-------|
| Render service | `ludecker-website` |
| Render workspace (MCP) | Erik — owner ID `tea-csp7qr3gbbvc73d1fvqg` |
| Smoke URL | `https://ludecker-website.onrender.com/` |
| MCP server | `user-render` only (not `plugin-render-render`) |

## Wave 0 — Preflight (mandatory)

Run **before** any git work on every ship:

```bash
pnpm typecheck
```

Exit non-zero → **STOP**. Do not commit or push.

Optional extras when intent says `with tests`:

```bash
pnpm -r test   # when test scripts exist
```

## Git (Wave 1 — blocking)

1. Confirm repo: `signalbynoise/ludecker` (or local ludecker monorepo)
2. `git status` + `git diff` + `git diff --staged` + `git log -5 --oneline`
3. Never stage `.env`, `.env.local`, credentials, or API keys
4. If `.github/workflows/**` push fails with OAuth `workflow` scope → unstage workflows, commit rest, note workflows for separate push
5. Draft 1–2 sentence commit message from diff and user intent
6. `git add` intentional paths → `git commit` (HEREDOC message)
7. Ensure on `main`: `git checkout main` if needed; `git pull --rebase origin main`
8. `git push origin main` — on reject, rebase once more; never force-push main
9. Output: `commit_sha`, `commit_message_first_line`, `commit_message_body`

**Rules:** No force-push main. On pre-commit hook failure: fix and new commit — never amend unless user asked.

## AAAC (Wave 1.5 — conditional after push)

Runs when `detect-aaac-changes.mjs` reports `needs_publish: true` for the pushed `commit_sha`.

**Detect:**

```bash
node .cursor/skills/shared/platform-release/scripts/detect-aaac-changes.mjs \
  --commit-sha <commit_sha>
```

**When triggered (blocking):**

1. Confirm `packages/aaac/package.json` version is bumped (ahead of latest `aaac-v*` tag)
2. Sync `packages/aaac/templates/` from dogfood if `.cursor/skills/shared/` or generic aaac kernel changed
3. Run checks:

```bash
node .cursor/skills/shared/platform-release/scripts/run-aaac-ship-checks.mjs \
  --smoke-dir /tmp/aaac-smoke-<run_id>
```

4. Tag and push (CI publishes — no local `npm publish`):

```bash
git tag aaac-v<version> <commit_sha>
git push origin aaac-v<version>
```

5. Monitor until npm shows the version:

```bash
node .cursor/skills/shared/platform-release/scripts/watch-aaac-publish.mjs \
  --version <version>
```

**Skip:** When `needs_publish: false`, record `aaac_publish_skipped: true` and continue to Render.

**Failure:** Check or monitor failure → **STOP**. Do not start Render poll.

Agent: [agents/release-aaac.md](../../../agents/release-aaac.md)

## Render (Wave 2 — mandatory after push)

**Do not** report ship complete until deploy is `live` or `build_failed` with evidence.

### Path A — Render MCP (preferred in Cursor)

1. `get_selected_workspace` on `user-render`
2. If no workspace: `select_workspace` with owner ID `tea-csp7qr3gbbvc73d1fvqg` (Erik — see `docs/deployment.md`)
3. `list_services` — find `name === "ludecker-website"`, note `id`
4. `list_deploys` (`limit: 5`) — match deploy `commit.id` to Wave 1 `commit_sha`
5. Poll up to **15 minutes**, every **30s**, via `list_deploys` / `get_deploy` until `status === "live"` or terminal failure
6. On failure: `list_logs` for build errors; include excerpt in report
7. Smoke check: `curl -fsS -o /dev/null -w "%{http_code}" https://ludecker-website.onrender.com/` — expect **200**

### Path B — CLI script (when `RENDER_API_KEY` is set)

```bash
node .cursor/skills/shared/platform-release/scripts/watch-render-deploy.mjs \
  --commit-sha <commit_sha>
```

Exit 0 = live + smoke 200. Exit 1 = failed/timeout. Exit 2 = no API key → use Path A.

## Wave 3 — Verify + report

- Confirm deploy commit matches pushed `commit_sha`
- Record deploy id, status, smoke HTTP code
- When AAAC wave ran: include version, tag, npm publish status
- [reporting/SKILL.md](../reporting/SKILL.md): layman summary + technical table (preflight, git, aaac, render, smoke)

## Anti-patterns

- Stopping after `git push` without Render poll
- Skipping preflight typecheck
- Using `plugin-render-render` MCP
- Reporting "should be building" instead of polled status
