import type { ArticleType } from "@ludecker/types";
import { ArticleBody } from "@ludecker/ui";

export interface ContentPreviewProps {
  content: string;
  articleType: ArticleType;
}

export function ContentPreview({ content, articleType }: ContentPreviewProps) {
  if (!content.trim()) {
    return (
      <p className="admin-preview__empty admin-hint">
        Add body text above to preview how readers will see it.
      </p>
    );
  }

  return (
    <div className="admin-preview" aria-label="Public site preview">
      <ArticleBody content={content} articleType={articleType} />
    </div>
  );
}
