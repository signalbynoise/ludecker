"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { invalidateContentQueries } from "@/src/lib/routing/loaders";
import type { ContentStatus } from "@ludecker/types";
import { bulkSetContentStatus } from "@/lib/api/cms";

export interface UseContentListBulkStatusResult {
  status: ContentStatus;
  setStatus: (status: ContentStatus) => void;
  applying: boolean;
  error: string | null;
  applyToSelection: (selectedIds: ReadonlySet<string>) => Promise<boolean>;
}

export function useContentListBulkStatus(): UseContentListBulkStatusResult {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      const result = await bulkSetContentStatus(ids, status);
      setApplying(false);

      if ("error" in result) {
        setError(result.error);
        return false;
      }

      await invalidateContentQueries(queryClient);
      await router.invalidate();
      return true;
    },
    [queryClient, router, status],
  );

  return {
    status,
    setStatus,
    applying,
    error,
    applyToSelection,
  };
}
