# Launch Lüdecker

**Manual local-dev command** — not routed through AAAC `graph.yaml` (same pattern as Arvid's platform-specific ship commands).

Kill stale local dev processes, start a **clean** Vite + Hono dev stack, and verify the site loads with CSS and JS (no 404 assets).

**Hard rule:** This is a **local dev** workflow only. Do not commit, push, or deploy unless the user asks separately.

---

## Parse input

From `$ARGUMENTS` and the user message:

| Flag | Effect |
|------|--------|
| `--no-kill` | Skip killing processes; only clean Vite cache and start dev |
| `--skip-checks` | Start dev only; skip HTTP/CSS/JS verification |
| `--port <n>` | Vite dev port (default **3001**); Hono API stays on **3000** |
| `--dry-run` | Print planned steps; do not kill, start, or curl |

---

## Preconditions

1. **Repo:** `git rev-parse --show-toplevel` must be the **ludecker** monorepo. If not, stop and tell the user to open the ludecker workspace.
2. **Env:** `apps/website/.env.local` should exist (copy from `.env.example` if missing). Do not read or print secret values.
3. **Package manager:** Use **pnpm** from repo root (`packageManager` in root `package.json`).

---

## Dev stack (SSOT)

| Process | Port | Role |
|---------|------|------|
| Hono API (`tsx server/index.ts`) | **3000** | `/api/*`, `/:type/:slug/raw`, `/health` |
| Vite (`vite --port 3001`) | **3001** (default) | SPA + HMR; proxies `/api` to 3000 |

**Open in browser:** `http://localhost:3001/` (not 3000).

`pnpm dev` runs both via `concurrently` in `apps/website/package.json`.

---

## Phase 1 — Kill stale servers (unless `--no-kill` or `--dry-run`)

Free API + Vite ports and common Supabase local ports so restarts are not fighting old processes.

Run from repo root (Vite port **3001** by default unless `--port` set):

```bash
# Hono API
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# Vite dev (website UI)
lsof -ti :3001 | xargs kill -9 2>/dev/null || true

# Optional: Supabase local stack (if user runs it)
lsof -ti :54321 | xargs kill -9 2>/dev/null || true
lsof -ti :54322 | xargs kill -9 2>/dev/null || true
lsof -ti :54323 | xargs kill -9 2>/dev/null || true
```

If `--port` is not 3001, kill that port instead of (or in addition to) 3001. Always kill **3000** (API).

Also stop any **background** dev terminals you started earlier in this session (do not leave duplicate `pnpm dev` running).

Report what was killed (port numbers only) or “nothing listening”.

---

## Phase 2 — Clean build cache (unless `--dry-run`)

Stale Vite pre-bundle cache can cause missing modules or broken HMR after large refactors.

```bash
rm -rf apps/website/node_modules/.vite
rm -rf apps/website/dist
```

Do **not** delete `node_modules` unless the user explicitly asks.

---

## Phase 3 — Start dev servers (unless `--dry-run`)

Start in the **background** from repo root:

```bash
pnpm dev
```

(`pnpm dev` → `@ludecker/website` → Hono on **3000** + Vite on **3001** via `concurrently`.)

Wait until both are ready:

- Poll `http://localhost:3001/` for Vite (expect **200**)
- Poll `http://localhost:3000/health` for Hono (expect JSON `{ ok: true }`)

Read terminal output for `vite` `ready` and `[server] listening`. Timeout **60s**; on failure, show the last 30 lines of dev logs and stop.

Tell the user: open **`http://localhost:3001/`** and **hard refresh** (Cmd+Shift+R) so old asset URLs are dropped.

If `--port` is set, pass it only to Vite — e.g. adjust the vite command in the background start or set `VITE_PORT` is **not** wired; instead run from `apps/website`:

```bash
pnpm --filter @ludecker/website exec concurrently -n server,vite -c blue,green "tsx server/index.ts" "vite --port <port>"
```

(Default path: use root `pnpm dev` when port is 3001.)

---

## Phase 4 — Verify (unless `--skip-checks` or `--dry-run`)

Run checks against **Vite** at `http://localhost:<vite-port>` (default **3001**) and **API** at `http://localhost:3000`.

### 4a — Homepage HTTP (Vite)

```bash
curl -fsS -o /dev/null -w "%{http_code}" http://localhost:3001/
```

Expect **200**.

### 4b — API health (Hono)

```bash
curl -fsS http://localhost:3000/health
```

Expect JSON containing `"ok":true`.

### 4c — API proxy (Vite → Hono)

```bash
curl -fsS -o /dev/null -w "%{http_code}" http://localhost:3001/api/public/home
```

Expect **200** (public content JSON). **502** means Vite is up but Hono is not — fail launch.

### 4d — Stylesheets (no 404)

Fetch the homepage HTML from port **3001** and extract `link[rel=stylesheet]` hrefs. For each href, request with the same origin and expect **200** (not 404).

Vite dev typically serves processed CSS via module graph (paths under `/src/` or `/@id/`). If no `<link rel=stylesheet">` tags appear, check that inline/style injection works by confirming the page HTML references `/src/main.tsx`.

If any stylesheet is **404**, treat as **failure**: repeat Phase 2–3, hard refresh.

### 4e — Critical JS modules (no 404)

From the same HTML, expect **200** for:

- `/@vite/client` (Vite HMR client)
- `/src/main.tsx` (app entry)

Expect **200** for each referenced script. **404** means broken dev cache — fail launch and repeat Phase 2–3.

### 4f — CSS content smoke test

Fetch the primary stylesheet (or request `/src/vite-styles.ts` pipeline output) and confirm processed CSS contains token-based rules such as:

- `.text-body` or `.docs-shell`
- `body` / link rules from globals (not an empty file)

### 4g — Typecheck (quick)

```bash
pnpm typecheck
```

Expect exit code **0**. On failure, report errors but still note whether dev is up.

### 4h — Env sanity (no secrets)

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
**Cache:** Vite cache + dist removed — yes / skipped
**Dev UI:** http://localhost:<vite-port>/ — running / failed
**Dev API:** http://localhost:3000/health — running / failed
**HTTP /** <code>
**API /health:** pass / fail
**API proxy /api/public/home:** <code>
**CSS:** <pass|fail> — <n> stylesheets checked
**JS modules:** <pass|fail> — <details if fail>
**Typecheck:** pass / fail
**Env:** `.env.local` present — yes / no
**Action for you:** Open http://localhost:<vite-port>/ and hard refresh (Cmd+Shift+R)
**Notes:** <errors, duplicate servers, etc.>
```

---

## Anti-patterns

- Creating or relying on a standalone shell script as the “command” — **this file is the command**; run steps via the Shell tool
- Leaving multiple `pnpm dev` / Vite / Hono processes on the same ports
- Opening **localhost:3000** for the UI (that is API-only in dev)
- Declaring success when `/@vite/client`, `/src/main.tsx`, or stylesheets return **404**
- Committing or pushing as part of launch
- Printing `SUPABASE_SERVICE_ROLE_KEY` or other secrets

---

## Examples

```
/launch-ludecker
```

Kill listeners on 3000 + 3001 (and Supabase local ports), wipe Vite cache, start `pnpm dev`, verify site + API + assets + typecheck.

```
/launch-ludecker --no-kill
```

Clean Vite cache and restart dev without killing processes first.

```
/launch-ludecker --skip-checks
```

Kill, clean, start dev only.

```
/launch-ludecker --port 3002
```

Use Vite on 3002; still kill/start API on 3000.

```
/launch-ludecker --dry-run
```

Show the plan without executing.
