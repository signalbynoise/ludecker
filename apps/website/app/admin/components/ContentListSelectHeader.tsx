"use client";

import { useEffect, useRef } from "react";

export interface ContentListSelectHeaderProps {
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onToggleAllVisible: () => void;
}

export function ContentListSelectHeader({
  allVisibleSelected,
  someVisibleSelected,
  onToggleAllVisible,
}: ContentListSelectHeaderProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  return (
    <th className="admin-table__select-col">
      <input
        ref={checkboxRef}
        type="checkbox"
        className="admin-table__checkbox"
        checked={allVisibleSelected}
        aria-label="select all visible rows"
        onChange={onToggleAllVisible}
      />
    </th>
  );
}
