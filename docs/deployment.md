# Deployment

## Prerequisites

- GitHub repository connected to Render
- Supabase project: `anseivwusnyiwopihnqu`
- Cloudflare account for DNS

## Environment variables

Set on Render (web service `ludecker-website`):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://anseivwusnyiwopihnqu.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, for SSG) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://ludecker.com`) |
| `REVALIDATE_SECRET` | Secret for `POST /api/revalidate` (on-demand ISR after CMS writes) |

Local development: copy `apps/website/.env.example` to `.env.local`. Use the **same** `REVALIDATE_SECRET` locally and on Render so `/write-article` persist can refresh production after `--publish`.

## Render (Erik workspace)

| Fact | Value |
|------|-------|
| Workspace | Erik |
| MCP owner ID | `tea-csp7qr3gbbvc73d1fvqg` |
| Service name | `ludecker-website` |
| Service URL | `https://ludecker-website.onrender.com/` |

Blueprint: `render.yaml` at repo root.

Ship commands poll Render until deploy is `live` (see `ship-procedure.md`). Optional CLI: set `RENDER_API_KEY` and run `watch-render-deploy.mjs`.

```bash
# Validate locally (optional)
render blueprints validate render.yaml
```

Manual deploy settings if not using Blueprint:

- **Root directory**: `apps/website`
- **Build**: `cd ../.. && pnpm install && pnpm --filter @ludecker/website build`
- **Start**: `pnpm start`
- **Node**: 20+

## Supabase

Migrations live in `supabase/migrations/`. Applied to remote via Supabase CLI or MCP.

Create a CMS user:

1. Supabase Dashboard → Authentication → Users → Add user
2. Sign in at `/admin/login`

## Cloudflare

1. Add site to Cloudflare.
2. Create CNAME: `@` or `www` → Render service URL (e.g. `ludecker-website.onrender.com`).
3. Enable proxy (orange cloud).
4. SSL mode: Full (strict).
5. Optional: cache rules for static assets (`/_next/static/*`).

## GitHub → Render flow

1. Push to `main`.
2. Render installs dependencies and builds Next.js.
3. Health check on `/`.
4. Cloudflare serves traffic to the Render origin.

## Local development

```bash
pnpm install
cp apps/website/.env.example apps/website/.env.local
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) for the public site and CMS (`/admin`). The Hono API listens on port 3000; Vite proxies `/api/*`.

Set `NEXT_PUBLIC_SITE_URL=http://localhost:3001` in `.env.local` when testing publish/revalidate locally.
