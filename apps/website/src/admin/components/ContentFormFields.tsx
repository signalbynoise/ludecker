"use client";

import {
  ARTICLE_TYPES,
  type ContentFormState,
  CONTENT_STATUS_VALUES,
} from "@ludecker/types";
import type { RefObject } from "react";
import { TagInput } from "@/src/admin/components/TagInput";

export interface ContentFormFieldsProps {
  form: ContentFormState;
  fileRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  onFieldChange: <K extends keyof ContentFormState>(
    key: K,
    value: ContentFormState[K],
  ) => void;
  onCoverUpload: () => void;
}

export function ContentFormFields({
  form,
  fileRef,
  uploading,
  onFieldChange,
  onCoverUpload,
}: ContentFormFieldsProps) {
  return (
    <>
      <div className="admin-field">
        <label htmlFor="title">title</label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="slug">slug</label>
        <input
          id="slug"
          required
          value={form.slug}
          onChange={(e) => onFieldChange("slug", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="excerpt">excerpt</label>
        <textarea
          id="excerpt"
          value={form.excerpt}
          onChange={(e) => onFieldChange("excerpt", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="content">content</label>
        <textarea
          id="content"
          required
          className="admin-field__content"
          value={form.content}
          onChange={(e) => onFieldChange("content", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="status">status</label>
        <select
          id="status"
          value={form.status}
          onChange={(e) =>
            onFieldChange(
              "status",
              e.target.value as (typeof CONTENT_STATUS_VALUES)[number],
            )
          }
        >
          {CONTENT_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-field">
        <label htmlFor="article_type">section</label>
        <select
          id="article_type"
          value={form.article_type}
          onChange={(e) =>
            onFieldChange(
              "article_type",
              e.target.value as ContentFormState["article_type"],
            )
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
        <label>tags</label>
        <TagInput
          initialTags={form.tagNames}
          onChange={(tagNames) => onFieldChange("tagNames", tagNames)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="cover">cover image</label>
        <input
          id="cover"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={() => void onCoverUpload()}
        />
        {uploading ? <p className="admin-table__meta">uploading…</p> : null}
        {form.cover_image ? (
          <input
            type="url"
            value={form.cover_image}
            onChange={(e) => onFieldChange("cover_image", e.target.value)}
          />
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="seo_title">seo title</label>
        <input
          id="seo_title"
          value={form.seo_title}
          onChange={(e) => onFieldChange("seo_title", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="seo_description">seo description</label>
        <textarea
          id="seo_description"
          value={form.seo_description}
          onChange={(e) => onFieldChange("seo_description", e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="featured">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => onFieldChange("featured", e.target.checked)}
          />{" "}
          featured (home page)
        </label>
      </div>
    </>
  );
}
