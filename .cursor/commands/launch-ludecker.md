# Launch Lüdecker

**Manual local-dev command** — not routed through AAAC `graph.yaml` (same pattern as Arvid's platform-specific ship commands).

Kill stale local dev processes, start a **clean** Next.js dev server, and verify the site loads with CSS and JS (no 404 chunks).

**Hard rule:** This is a **local dev** workflow only. Do not commit, push, or deploy unless the user asks separately.

---

## Parse input

From `$ARGUMENTS` and the user message:

| Flag | Effect |
|------|--------|
| `--no-kill` | Skip killing processes; only clean `.next` and start dev |
| `--skip-checks` | Start dev only; skip HTTP/CSS/JS verification |
| `--port <n>` | Dev port (default **3000**) |
| `--dry-run` | Print planned steps; do not kill, start, or curl |

---

## Preconditions

1. **Repo:** `git rev-parse --show-toplevel` must be the **ludecker** monorepo. If not, stop and tell the user to open the ludecker workspace.
2. **Env:** `apps/website/.env.local` should exist (copy from `.env.example` if missing). Do not read or print secret values.
3. **Package manager:** Use **pnpm** from repo root (`packageManager` in root `package.json`).

---

## Phase 1 — Kill stale servers (unless `--no-kill` or `--dry-run`)

Free the dev port and common Next/Supabase local ports so restarts are not fighting old processes.

Run from repo root (default port **3000** unless `--port` set):

```bash
# Next.js dev (website)
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# Optional: Supabase local stack (if user runs it)
lsof -ti :54321 | xargs kill -9 2>/dev/null || true
lsof -ti :54322 | xargs kill -9 2>/dev/null || true
lsof -ti :54323 | xargs kill -9 2>/dev/null || true
```

If `--port` is not 3000, kill that port instead of (or in addition to) 3000.

Also stop any **background** dev terminals you started earlier in this session (do not leave duplicate `next dev` running).

Report what was killed (port numbers only) or “nothing listening”.

---

## Phase 2 — Clean build cache (unless `--dry-run`)

Stale `.next` causes 404s for `layout.css`, `main-app.js`, and `app/(public)/layout.js` with mismatched `?v=` hashes — the page then renders **unstyled** (blue default links).

```bash
rm -rf apps/website/.next
```

Do **not** delete `node_modules` unless the user explicitly asks.

---

## Phase 3 — Start dev server (unless `--dry-run`)

Start in the **background** from repo root:

```bash
pnpm dev
```

(`pnpm dev` runs `@ludecker/website` → `next dev --port 3000`.)

Wait until the server is ready (poll `http://localhost:<port>/` or read terminal output for `Ready` / `Local:`). Timeout **60s**; on failure, show the last 30 lines of dev logs and stop.

Tell the user: **hard refresh** the browser (Cmd+Shift+R) after launch so old asset URLs are dropped.

---

## Phase 4 — Verify (unless `--skip-checks` or `--dry-run`)

Run checks against `http://localhost:<port>` (default 3000).

### 4a — Homepage HTTP

```bash
curl -fsS -o /dev/null -w "%{http_code}" http://localhost:3000/
```

Expect **200**.

### 4b — Stylesheets (no 404)

Fetch the homepage HTML and extract `link[rel=stylesheet]` hrefs. For each href, request with the same origin and expect **200** (not 404).

Pay special attention to:

- `/_next/static/css/app/layout.css`
- `/_next/static/css/app/(public)/layout.css` (if present — may 200 with empty or client CSS)

If any stylesheet is **404**, treat as **failure**: recommend `rm -rf apps/website/.next`, restart dev, hard refresh.

### 4c — Critical JS chunks (no 404)

From the same HTML, request these (with the page’s `?v=` query string if present):

- `/_next/static/chunks/main-app.js`
- `/_next/static/chunks/app-pages-internals.js`
- `/_next/static/chunks/app/(public)/layout.js` (if referenced)

Expect **200** for each referenced script. **404** here means stale tab or broken dev cache — fail the launch and repeat Phase 2–3.

### 4d — CSS content smoke test

Fetch `app/layout.css` (with correct `?v=` from HTML) and confirm it contains at least:

- `.text-body`
- `.site-layout`
- `.page-shell`
- `body` rules from globals (e.g. `color: inherit` on `a`, not missing entirely)

### 4e — Typecheck (quick)

```bash
pnpm typecheck
```

Expect exit code **0**. On failure, report errors but still note whether dev is up (dev can run with TS errors in some cases).

### 4f — Env sanity (no secrets)

Confirm files exist without printing values:

- `apps/website/.env.local` exists
- Required keys are **named** in `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

If `.env.local` is missing, warn that CMS/admin may fail; do not block dev start.

---

## Phase 5 — Launch report

Output:

```markdown
## Launch Lüdecker — Report

**Killed:** ports <list> / none
**Cache:** `.next` removed — yes / skipped
**Dev:** http://localhost:<port>/ — running / failed
**HTTP /** <code>
**CSS:** <pass|fail> — <n> stylesheets checked
**JS chunks:** <pass|fail> — <details if fail>
**Typecheck:** pass / fail
**Env:** `.env.local` present — yes / no
**Action for you:** Hard refresh browser (Cmd+Shift+R)
**Notes:** <errors, duplicate servers, etc.>
```

---

## Anti-patterns

- Creating or relying on a standalone shell script as the “command” — **this file is the command**; run steps via the Shell tool
- Leaving multiple `next dev` processes on the same port
- Declaring success when CSS or `main-app.js` return **404**
- Committing or pushing as part of launch
- Printing `SUPABASE_SERVICE_ROLE_KEY` or other secrets

---

## Examples

```
/launch-ludecker
```

Kill listeners on 3000 (and Supabase local ports), wipe `.next`, start `pnpm dev`, verify site + assets + typecheck.

```
/launch-ludecker --no-kill
```

Clean `.next` and restart dev without killing processes first.

```
/launch-ludecker --skip-checks
```

Kill, clean, start dev only.

```
/launch-ludecker --dry-run
```

Show the plan without executing.
