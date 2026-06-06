"use client";

import type { ContentFormState, ContentWithTags } from "@ludecker/types";
import { toContentFormState } from "@ludecker/types";
import { slugify } from "@ludecker/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { invalidateContentQueries } from "@/src/lib/routing/loaders";
import { useRef, useState } from "react";
import {
  createContent,
  deleteContent,
  publishContent,
  unpublishContent,
  updateContent,
  uploadCoverImage,
} from "@/lib/api/cms";

export interface UseContentFormOptions {
  mode: "create" | "edit";
  initial?: ContentWithTags;
}

export function useContentForm({ mode, initial }: UseContentFormOptions) {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
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
        ? await createContent(form)
        : await updateContent(initial!.id, form);

    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    if (mode === "create" && "id" in result) {
      navigate({
        to: "/admin/content/$id/edit",
        params: { id: result.id },
      });
      return;
    }

    await invalidateContentQueries(queryClient);
    await router.invalidate();
  }

  async function handlePublish() {
    if (!initial) return;
    setSaving(true);
    const result = await publishContent(initial.id);
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setForm((prev) => ({ ...prev, status: "published" }));
    await invalidateContentQueries(queryClient);
    await router.invalidate();
  }

  async function handleUnpublish() {
    if (!initial) return;
    setSaving(true);
    const result = await unpublishContent(initial.id);
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setForm((prev) => ({ ...prev, status: "draft" }));
    await invalidateContentQueries(queryClient);
    await router.invalidate();
  }

  async function handleDelete() {
    if (!initial) return;
    if (!window.confirm("Delete this content permanently?")) return;

    setSaving(true);
    const result = await deleteContent(initial.id);
    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    navigate({ to: "/admin" });
  }

  async function handleCoverUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const result = await uploadCoverImage(file);
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
