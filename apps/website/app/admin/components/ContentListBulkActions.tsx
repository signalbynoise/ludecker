"use client";

import { CONTENT_STATUS_VALUES, type ContentStatus } from "@ludecker/types";
import { Button } from "@ludecker/ui";

export interface ContentListBulkActionsProps {
  selectedCount: number;
  status: ContentStatus;
  applying: boolean;
  error: string | null;
  onStatusChange: (status: ContentStatus) => void;
  onApply: () => void;
  onClear: () => void;
}

export function ContentListBulkActions({
  selectedCount,
  status,
  applying,
  error,
  onStatusChange,
  onApply,
  onClear,
}: ContentListBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="admin-bulk-actions" role="region" aria-label="bulk actions">
      <p className="admin-bulk-actions__count">
        {selectedCount} selected
      </p>
      <div className="admin-bulk-actions__controls">
        <div className="admin-bulk-actions__field">
          <label htmlFor="bulk-status">status</label>
          <select
            id="bulk-status"
            value={status}
            disabled={applying}
            onChange={(e) =>
              onStatusChange(e.target.value as ContentStatus)
            }
          >
            {CONTENT_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="primary"
          disabled={applying}
          onClick={() => void onApply()}
        >
          {applying ? "applying…" : "apply"}
        </Button>
        <button
          type="button"
          className="admin-bulk-actions__clear"
          disabled={applying}
          onClick={onClear}
        >
          clear
        </button>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  );
}
