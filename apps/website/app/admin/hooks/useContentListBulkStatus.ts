"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentStatus } from "@ludecker/types";
import { bulkSetContentStatusAction } from "@/app/admin/actions/content";

export interface UseContentListBulkStatusResult {
  status: ContentStatus;
  setStatus: (status: ContentStatus) => void;
  applying: boolean;
  error: string | null;
  applyToSelection: (selectedIds: ReadonlySet<string>) => Promise<boolean>;
}

export function useContentListBulkStatus(): UseContentListBulkStatusResult {
  const router = useRouter();
  const [status, setStatus] = useState<ContentStatus>("published");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyToSelection = useCallback(
    async (selectedIds: ReadonlySet<string>): Promise<boolean> => {
      const ids = [...selectedIds];
      if (ids.length === 0) {
        return false;
      }

      setApplying(true);
      setError(null);
      const result = await bulkSetContentStatusAction(ids, status);
      setApplying(false);

      if ("error" in result) {
        setError(result.error);
        return false;
      }

      router.refresh();
      return true;
    },
    [router, status],
  );

  return {
    status,
    setStatus,
    applying,
    error,
    applyToSelection,
  };
}
