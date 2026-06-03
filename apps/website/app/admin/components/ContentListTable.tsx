"use client";

import Link from "next/link";
import { getContentKind, getSectionLabel } from "@ludecker/types";
import type { ContentWithTags } from "@ludecker/types";
import { ContentListSelectHeader } from "@/app/admin/components/ContentListSelectHeader";
import { ContentRowPreview } from "@/app/admin/components/ContentRowPreview";

export interface ContentListTableProps {
  items: ContentWithTags[];
  isSelected: (id: string) => boolean;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onToggleOne: (id: string) => void;
  onToggleAllVisible: () => void;
}

export function ContentListTable({
  items,
  isSelected,
  allVisibleSelected,
  someVisibleSelected,
  onToggleOne,
  onToggleAllVisible,
}: ContentListTableProps) {
  if (items.length === 0) {
    return <p className="admin-empty">No content matches your search.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <ContentListSelectHeader
            allVisibleSelected={allVisibleSelected}
            someVisibleSelected={someVisibleSelected}
            onToggleAllVisible={onToggleAllVisible}
          />
          <th className="admin-table__title-col">title</th>
          <th className="admin-table__meta-col">section</th>
          <th className="admin-table__meta-col">kind</th>
          <th className="admin-table__meta-col">status</th>
          <th className="admin-table__meta-col">updated</th>
          <th className="admin-table__actions-col" aria-label="actions" />
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className={isSelected(item.id) ? "admin-table__row--selected" : undefined}
          >
            <td className="admin-table__select-col">
              <input
                type="checkbox"
                className="admin-table__checkbox"
                checked={isSelected(item.id)}
                aria-label={`select ${item.title}`}
                onChange={() => onToggleOne(item.id)}
              />
            </td>
            <td className="admin-table__title-col">
              <Link
                className="admin-table__title"
                href={`/admin/content/${item.id}/edit`}
              >
                {item.title}
              </Link>
            </td>
            <td className="admin-table__meta admin-table__meta-col">
              {getSectionLabel(item.article_type)}
            </td>
            <td className="admin-table__meta admin-table__meta-col">
              {getContentKind(item)}
            </td>
            <td className="admin-table__meta-col">
              <span className={`admin-status admin-status--${item.status}`}>
                {item.status}
              </span>
            </td>
            <td className="admin-table__meta admin-table__meta-col">
              {new Date(item.updated_at).toLocaleString()}
            </td>
            <td className="admin-table__actions-col">
              <ContentRowPreview item={item} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
