"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "@ludecker/ui";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  return (
    <Button type="button" variant="secondary" onClick={handleLogout}>
      sign out
    </Button>
  );
}
