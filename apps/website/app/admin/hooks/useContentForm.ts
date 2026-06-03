"use client";

import type { ContentFormState, ContentWithTags } from "@ludecker/types";
import { toContentFormState } from "@ludecker/types";
import { slugify } from "@ludecker/utils";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  createContentAction,
  deleteContentAction,
  publishContentAction,
  unpublishContentAction,
  updateContentAction,
  uploadCoverImageAction,
} from "@/app/admin/actions/content";

export interface UseContentFormOptions {
  mode: "create" | "edit";
  initial?: ContentWithTags;
}

export function useContentForm({ mode, initial }: UseContentFormOptions) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ContentFormState>(() =>
    toContentFormState(initial),
  );
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

  return {
    fileRef,
    form,
    error,
    saving,
    uploading,
    updateField,
    handleSave,
    handlePublish,
    handleUnpublish,
    handleDelete,
    handleCoverUpload,
  };
}
