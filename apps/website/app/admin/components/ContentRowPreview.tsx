import { ButtonLink } from "@ludecker/ui";
import { getContentPublicPath } from "@ludecker/utils";
import type { ContentWithTags } from "@ludecker/types";

export interface ContentRowPreviewProps {
  item: ContentWithTags;
}

export function ContentRowPreview({ item }: ContentRowPreviewProps) {
  if (item.status !== "published") {
    return null;
  }

  return (
    <div className="admin-table__actions">
      <ButtonLink
        href={getContentPublicPath(item.article_type, item.slug)}
        target="_blank"
        rel="noopener noreferrer"
      >
        preview
      </ButtonLink>
    </div>
  );
}
