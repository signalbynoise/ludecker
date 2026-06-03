"use client";

import {
  ARTICLE_TYPES,
  type ContentStatus,
  type ContentWithTags,
} from "@ludecker/types";
import { slugify } from "@ludecker/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  createContentAction,
  deleteContentAction,
  publishContentAction,
  unpublishContentAction,
  updateContentAction,
  uploadCoverImageAction,
  type ContentFormState,
} from "@/app/admin/actions/content";
import { TagInput } from "@/app/admin/components/TagInput";

export interface ContentFormProps {
  mode: "create" | "edit";
  initial?: ContentWithTags;
}

function toFormState(content?: ContentWithTags): ContentFormState {
  return {
    title: content?.title ?? "",
    slug: content?.slug ?? "",
    excerpt: content?.excerpt ?? "",
    content: content?.content ?? "",
    status: content?.status ?? "draft",
    article_type: content?.article_type ?? "article",
    tagNames: content?.tags.map((tag) => tag.name) ?? [],
    cover_image: content?.cover_image ?? "",
    seo_title: content?.seo_title ?? "",
    seo_description: content?.seo_description ?? "",
    featured: content?.featured ?? false,
  };
}

export function ContentForm({ mode, initial }: ContentFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ContentFormState>(() => toFormState(initial));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField<K extends keyof ContentFormState>(
    key: K,
    value: ContentFormState[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && mode === "create" && !prev.slug) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result =
      mode === "create"
        ? await createContentAction(form)
        : await updateContentAction(initial!.id, form);

    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    if (mode === "create" && "id" in result) {
      router.push(`/admin/content/${result.id}/edit`);
      router.refresh();
      return;
    }

    router.refresh();
  }

  async function handlePublish() {
    if (!initial) return;
    setSaving(true);
    const result = await publishContentAction(initial.id);
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setForm((prev) => ({ ...prev, status: "published" }));
    router.refresh();
  }

  async function handleUnpublish() {
    if (!initial) return;
    setSaving(true);
    const result = await unpublishContentAction(initial.id);
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setForm((prev) => ({ ...prev, status: "draft" }));
    router.refresh();
  }

  async function handleDelete() {
    if (!initial) return;
    if (!window.confirm("Delete this content permanently?")) return;

    setSaving(true);
    const result = await deleteContentAction(initial.id);
    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleCoverUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const body = new FormData();
    body.set("file", file);
    const result = await uploadCoverImageAction(body);
    setUploading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    updateField("cover_image", result.url);
  }

  return (
    <form className="admin-form" onSubmit={handleSave}>
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          required
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          value={form.excerpt}
          onChange={(e) => updateField("excerpt", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          required
          value={form.content}
          onChange={(e) => updateField("content", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={form.status}
          onChange={(e) =>
            updateField("status", e.target.value as ContentStatus)
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="admin-field">
        <label htmlFor="article_type">Article type</label>
        <select
          id="article_type"
          value={form.article_type}
          onChange={(e) =>
            updateField("article_type", e.target.value as ContentFormState["article_type"])
          }
        >
          {ARTICLE_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-field">
        <label>Tags</label>
        <TagInput
          initialTags={form.tagNames}
          onChange={(tagNames) => updateField("tagNames", tagNames)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="cover">Cover image</label>
        <input
          id="cover"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={() => void handleCoverUpload()}
        />
        {uploading ? <p>Uploading…</p> : null}
        {form.cover_image ? (
          <input
            type="url"
            value={form.cover_image}
            onChange={(e) => updateField("cover_image", e.target.value)}
          />
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="seo_title">SEO title</label>
        <input
          id="seo_title"
          value={form.seo_title}
          onChange={(e) => updateField("seo_title", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="seo_description">SEO description</label>
        <textarea
          id="seo_description"
          value={form.seo_description}
          onChange={(e) => updateField("seo_description", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="featured">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
          />{" "}
          Featured (home page)
        </label>
      </div>

      <div className="admin-actions">
        <button
          type="submit"
          className="admin-button admin-button--primary"
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {mode === "edit" && initial ? (
          <>
            <button
              type="button"
              className="admin-button admin-button--primary"
              onClick={() => void handlePublish()}
              disabled={saving}
            >
              Publish
            </button>
            <button
              type="button"
              className="admin-button"
              onClick={() => void handleUnpublish()}
              disabled={saving}
            >
              Unpublish
            </button>
            <button
              type="button"
              className="admin-button admin-button--danger"
              onClick={() => void handleDelete()}
              disabled={saving}
            >
              Delete
            </button>
          </>
        ) : null}
        <Link href="/admin" className="admin-button">
          Back
        </Link>
      </div>
    </form>
  );
}
