import type { ContentFormState } from "@ludecker/types";
import { slugify } from "@ludecker/utils";

export function validateContentFormState(
  input: ContentFormState,
): string | null {
  if (!input.title.trim()) {
    return "Title is required.";
  }

  if (!input.slug.trim()) {
    return "Slug is required.";
  }

  const normalizedSlug = slugify(input.slug);
  if (normalizedSlug !== input.slug.trim()) {
    return "Slug must be URL-safe (lowercase letters, numbers, hyphens).";
  }

  if (!input.content.trim()) {
    return "Content is required.";
  }

  return null;
}

export function normalizeContentFormState(
  input: ContentFormState,
): ContentFormState {
  return {
    ...input,
    title: input.title.trim(),
    slug: slugify(input.slug),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    tagNames: input.tagNames.map((tag) => tag.trim()).filter(Boolean),
    cover_image: input.cover_image.trim(),
    seo_title: input.seo_title.trim(),
    seo_description: input.seo_description.trim(),
  };
}
