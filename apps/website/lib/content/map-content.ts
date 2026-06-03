import type { Content, ContentWithTags, Tag } from "@ludecker/types";

interface ContentTagRow {
  tags: Tag | Tag[] | null;
}

interface ContentRow extends Record<string, unknown> {
  content_tags?: ContentTagRow[] | null;
}

export function mapContentRow(row: ContentRow): Content {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: row.excerpt != null ? String(row.excerpt) : null,
    content: String(row.content ?? ""),
    status: row.status as Content["status"],
    article_type: row.article_type as Content["article_type"],
    cover_image: row.cover_image != null ? String(row.cover_image) : null,
    seo_title: row.seo_title != null ? String(row.seo_title) : null,
    seo_description:
      row.seo_description != null ? String(row.seo_description) : null,
    featured: Boolean(row.featured),
    published_at:
      row.published_at != null ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapContentWithTagsRow(row: ContentRow): ContentWithTags {
  const content = mapContentRow(row);
  const tags: Tag[] = [];

  for (const link of row.content_tags ?? []) {
    const tagData = link.tags;
    if (!tagData) continue;
    if (Array.isArray(tagData)) {
      tags.push(...tagData);
    } else {
      tags.push(tagData);
    }
  }

  return { ...content, tags };
}

export const CONTENT_SELECT = `
  *,
  content_tags (
    tags (*)
  )
` as const;
