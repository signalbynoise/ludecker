"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonClassName } from "@ludecker/ui";
import { createLogger } from "@ludecker/utils";

const log = createLogger("admin:error");

export interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    log.error("render", "admin route failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="admin-main">
      <h1 className="admin-title">something went wrong</h1>
      <p className="admin-error">{error.message}</p>
      <div className="admin-actions">
        <Button variant="primary" onClick={reset}>
          try again
        </Button>
        <Link href="/admin" className={buttonClassName()}>
          dashboard
        </Link>
      </div>
    </main>
  );
}
