import Link from "next/link";
import { ButtonLink } from "@ludecker/ui";
import { getContentPublicPath } from "@ludecker/utils";
import type { ContentWithTags } from "@ludecker/types";

export interface ContentRowActionsProps {
  item: ContentWithTags;
}

export function ContentRowActions({ item }: ContentRowActionsProps) {
  const previewHref =
    item.status === "published"
      ? getContentPublicPath(item.article_type, item.slug)
      : null;

  return (
    <div className="admin-row-actions">
      <Link
        className="admin-table__title"
        href={`/admin/content/${item.id}/edit`}
      >
        {item.title}
      </Link>
      {previewHref ? (
        <ButtonLink
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          preview
        </ButtonLink>
      ) : null}
    </div>
  );
}
