# Kill Local Dev Servers

**Manual local-dev command** — not routed through AAAC `graph.yaml`.

Kill all local Lüdecker dev processes by terminating listeners on the Next.js dev port and the Supabase local stack ports.

## Steps

1. Kill processes on ports 3000, 54321, 54322, 54323:
   ```bash
   lsof -ti:3000,54321,54322,54323 | xargs kill -9 2>/dev/null
   ```

2. Verify the ports are free by confirming no processes remain:
   ```bash
   lsof -ti:3000,54321,54322,54323
   ```

Report which ports had listeners (or “nothing listening”) for each port.
