"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TEXT_BODY_CLASS } from "@ludecker/ui";
import { createLogger } from "@ludecker/utils";
import "./error.css";

const log = createLogger("app:error");

export interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function isCorruptDevBuild(message: string): boolean {
  return message.includes("routes-manifest.json") || message.includes("ENOENT");
}

export default function RootError({ error, reset }: RootErrorProps) {
  const corruptDevBuild = isCorruptDevBuild(error.message);

  useEffect(() => {
    log.error("render", "route failed", {
      message: error.message,
      digest: error.digest,
      corruptDevBuild,
    });
  }, [corruptDevBuild, error]);

  return (
    <main className={`${TEXT_BODY_CLASS} error-page`}>
      <h1 className={`${TEXT_BODY_CLASS} error-page__title`}>something went wrong</h1>
      <p className={`${TEXT_BODY_CLASS} error-page__message`}>{error.message}</p>
      {corruptDevBuild ? (
        <p className={`${TEXT_BODY_CLASS} error-page__hint`}>
          The dev build cache looks corrupted. Stop the server, then run{" "}
          <code>pnpm --filter @ludecker/website dev</code> from the repo root.
          Do not use <code>next start</code> locally unless you ran{" "}
          <code>pnpm build</code> first.
        </p>
      ) : null}
      <div className="error-page__actions">
        <button type="button" className={`${TEXT_BODY_CLASS} error-page__retry`} onClick={reset}>
          try again
        </button>
        <Link href="/" className={`${TEXT_BODY_CLASS} error-page__link`}>
          home
        </Link>
      </div>
    </main>
  );
}
