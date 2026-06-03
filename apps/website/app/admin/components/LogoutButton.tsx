"use client";

import { useRouter } from "next/navigation";
import { Button } from "@ludecker/ui";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleLogout}>
      sign out
    </Button>
  );
}
