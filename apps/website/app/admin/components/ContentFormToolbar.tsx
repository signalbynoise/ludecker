"use client";

import type { ContentFormState, ContentWithTags } from "@ludecker/types";
import { Button, ButtonLink, buttonClassName } from "@ludecker/ui";
import { getContentPublicPath } from "@ludecker/utils";
import Link from "next/link";

export interface ContentFormToolbarProps {
  mode: "create" | "edit";
  form: ContentFormState;
  initial?: ContentWithTags;
  saving: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}

export function ContentFormToolbar({
  mode,
  form,
  initial,
  saving,
  onPublish,
  onUnpublish,
  onDelete,
}: ContentFormToolbarProps) {
  const previewHref =
    mode === "edit" && initial && form.slug
      ? getContentPublicPath(form.article_type, form.slug)
      : null;

  return (
    <div className="admin-actions">
      <Button type="submit" variant="primary" disabled={saving}>
        {saving ? "saving…" : "save"}
      </Button>

      {mode === "edit" && initial ? (
        <>
          <Button
            variant="primary"
            disabled={saving}
            onClick={() => void onPublish()}
          >
            publish
          </Button>
          <Button disabled={saving} onClick={() => void onUnpublish()}>
            unpublish
          </Button>
          {previewHref && form.status === "published" ? (
            <ButtonLink
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              preview
            </ButtonLink>
          ) : null}
          <Button
            variant="danger"
            disabled={saving}
            onClick={() => void onDelete()}
          >
            delete
          </Button>
        </>
      ) : null}

      <Link href="/admin" className={buttonClassName()}>
        back
      </Link>
    </div>
  );
}
