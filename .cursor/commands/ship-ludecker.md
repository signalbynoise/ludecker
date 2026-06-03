# Ship Lüdecker

Commit **all** uncommitted work in this repo (from any Cursor chat — git only sees the working tree), push to `main`, then verify the Render deployment for **ludecker-website**.

**Hard rule:** Do not use `git push --force` to `main` unless the user explicitly requests it in this run.

---

## Parse input

From `$ARGUMENTS` and the user message:

| Flag | Effect |
|------|--------|
| `--no-commit` | Push only; skip staging/commit (working tree must be clean) |
| `--message "…"` | Use this commit subject (body optional after blank line) |
| `--skip-deploy-check` | Push to `main` only; skip Render polling |
| `--dry-run` | Report what would be committed/pushed; do not commit, push, or poll |

If the user gives a one-line intent (e.g. `/ship-ludecker fix hero spacing`), use it as the commit subject unless `--message` is set.

---

## Preconditions

1. **Repo:** `git rev-parse --show-toplevel` must be the **ludecker** monorepo (`signalbynoise/ludecker` remote). If not, stop and tell the user to open the ludecker workspace.
2. **Secrets:** Never stage `.env`, `.env.local`, credentials, or API keys. If any would be committed, stop and list the paths.
3. **Branch target:** Final push must land on `origin/main`. If the current branch is not `main`, either merge/rebase onto `main` first (with a short plan in chat) or ask the user — do not force-push.

---

## Phase 1 — Inventory (always)

Run in parallel:

```bash
git status
git diff
git diff --staged
git log -5 --oneline
git branch -vv
```

Summarize: modified/untracked files, whether `main` is behind/ahead of `origin/main`, and whether a commit is needed.

**“All chats”:** Every Cursor session writes to the same working tree. This phase captures **all** pending filesystem changes, not only the current chat.

---

## Phase 2 — Commit (unless `--no-commit` or `--dry-run`)

Skip when `git status` is clean (nothing to commit).

1. Stage intentional changes only (`git add` relevant paths; prefer `git add -A` only after confirming no secrets).
2. Draft a **1–2 sentence** commit message from the diff and user intent; match recent `git log` style.
3. Commit with a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
Subject line here.

Optional body with why, not a file list.
EOF
)"
```

If pre-commit hooks fail: **fix and create a new commit** — never `--amend` unless the user explicitly asked.

---

## Phase 3 — Sync and push `main`

1. Ensure on `main`: `git checkout main` if needed (stash or merge per situation; explain in chat).
2. Integrate remote if behind:

```bash
git pull --rebase origin main
```

3. Push:

```bash
git push origin main
```

If push is rejected, `git pull --rebase origin main` once more, resolve conflicts if any, then push again. Stop on unrecoverable conflicts — do not force-push.

Record **`HEAD` SHA** after a successful push (`git rev-parse HEAD`).

---

## Phase 4 — Render deploy check (unless `--skip-deploy-check` or `--dry-run`)

**Service (SSOT):** `ludecker-website` — see `render.yaml` and `docs/deployment.md`.

### Resolve service

Prefer **Render MCP** (`user-render`):

1. `list_services` — find `name === "ludecker-website"`, note `id` (e.g. `srv-…`).
2. If MCP is unavailable, try Render CLI: `render services -o json` (after `render login`), or tell the user to connect Render MCP.

### Wait for deploy

Auto-deploy is on **`main`** commits. After push:

1. `list_deploys` for the service (`limit: 5`).
2. Find the deploy whose `commit.id` matches **`HEAD` SHA** (or the newest deploy if SHA not yet attached — poll up to **15 minutes**, every **30s**).
3. Terminal success: `status === "live"`.
4. Terminal failure: `build_failed`, `update_failed`, `canceled`, or timeout — fetch details with `get_deploy`, then `list_logs` with `resource: [<serviceId>]`, `type: ["build","app"]`, `limit: 50` for errors.

### Smoke check

When deploy is `live`, verify the site responds:

```bash
curl -fsS -o /dev/null -w "%{http_code}" https://ludecker-website.onrender.com/
```

Expect **200** on `/`. On failure, report status code and recent build logs.

---

## Phase 5 — Ship report

Output:

```markdown
## Ship Lüdecker — Report

**Commit:** <sha> — <subject> (or "none — already clean")
**Push:** origin/main — ok / failed
**Render:** <deploy id> — <status> — [dashboard](https://dashboard.render.com/web/<serviceId>)
**Site:** https://ludecker-website.onrender.com/ — HTTP <code>
**Notes:** <conflicts, skipped files, MCP/CLI issues>
```

---

## Anti-patterns

- Force-pushing `main`
- Committing `.env*` or service role keys
- Declaring success before Render status is `live` (when deploy check is enabled)
- Amending a failed hook commit
- Shipping from a different repo or wrong Render service name

---

## Examples

```
/ship-ludecker
```

Commit all pending changes, push `main`, wait for Render, smoke-check `/`.

```
/ship-ludecker --message "Fix CMS publish revalidation"
```

Same with a fixed commit subject.

```
/ship-ludecker --no-commit --skip-deploy-check
```

Push existing commits on `main` only (no Render wait).

```
/ship-ludecker --dry-run
```

Show planned commit message and push/deploy steps without executing.
