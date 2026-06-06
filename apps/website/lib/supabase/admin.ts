import { createClient } from "@supabase/supabase-js";
import { createLogger } from "@ludecker/utils";
import ws from "ws";

const log = createLogger("supabase:admin");

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

let adminClient: ReturnType<typeof createClient> | null = null;

/** Server-only Supabase client for build-time SSG and static generation. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    log.warn("createAdminClient", "Missing Supabase credentials");
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
