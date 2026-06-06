"use client";

import { SiteNav } from "@ludecker/ui";
import { usePathname } from "next/navigation";
import { resolveActiveNavId } from "@/lib/nav/resolve-active-nav-id";

export function SiteNavActive() {
  const pathname = usePathname();
  return <SiteNav activeId={resolveActiveNavId(pathname)} />;
}
