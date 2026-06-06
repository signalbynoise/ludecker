import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<typeof setCookie>[3];
};

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase public credentials");
  }
  return { url, key };
}

export function createSupabaseClient(c: Context): SupabaseClient {
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        const all: { name: string; value: string }[] = [];
        const header = c.req.header("cookie");
        if (!header) return all;
        for (const part of header.split(";")) {
          const [name, ...rest] = part.trim().split("=");
          if (name) {
            all.push({ name, value: rest.join("=") });
          }
        }
        return all;
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, options);
        });
      },
    },
  });
}

export async function requireUser(c: Context): Promise<{
  supabase: SupabaseClient;
  user: { id: string };
}> {
  const supabase = createSupabaseClient(c);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("UNAUTHORIZED");
  }

  return { supabase, user: { id: user.id } };
}
