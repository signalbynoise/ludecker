import Link from "next/link";
import type { ReactNode } from "react";
import { CMS_CONFIG } from "@/lib/constants";

export interface AdminHeaderProps {
  backHref?: string;
  backLabel?: string;
  brandHref?: string;
  brandLabel?: string;
  actions?: ReactNode;
}

export function AdminHeader({
  backHref,
  backLabel,
  brandHref = "/admin",
  brandLabel = CMS_CONFIG.title,
  actions,
}: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header__start">
        {backHref ? (
          <Link className="admin-header__back" href={backHref}>
            {backLabel ?? "← Dashboard"}
          </Link>
        ) : (
          <Link className="admin-header__brand" href={brandHref}>
            {brandLabel}
          </Link>
        )}
      </div>
      {actions ? <div className="admin-header__actions">{actions}</div> : null}
    </header>
  );
}
