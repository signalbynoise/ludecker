import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";

const auth = new Hono();

auth.get("/session", async (c) => {
  const supabase = createSupabaseClient(c);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return c.json({ user: null }, 401);
  }
  return c.json({ user: { id: user.id, email: user.email } });
});

export { auth };
