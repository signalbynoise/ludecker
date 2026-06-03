"use client";

import { SiteNav } from "@ludecker/ui";
import { NAV_ITEMS } from "@ludecker/types";
import { usePathname } from "next/navigation";

function resolveActiveNavId(pathname: string): string | undefined {
  if (pathname === "/") return undefined;

  const match = NAV_ITEMS.find((item) => {
    if (pathname === item.href) return true;
    if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;
    if (pathname.startsWith(`/${item.articleType}/`)) return true;
    return false;
  });

  return match?.id;
}

export function SiteNavActive() {
  const pathname = usePathname();
  return <SiteNav activeId={resolveActiveNavId(pathname)} />;
}
