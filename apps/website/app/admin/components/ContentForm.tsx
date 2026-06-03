"use client";

import type { ContentWithTags } from "@ludecker/types";
import { ContentFormFields } from "@/app/admin/components/ContentFormFields";
import { ContentFormToolbar } from "@/app/admin/components/ContentFormToolbar";
import { useContentForm } from "@/app/admin/hooks/useContentForm";

export interface ContentFormProps {
  mode: "create" | "edit";
  initial?: ContentWithTags;
}

export function ContentForm({ mode, initial }: ContentFormProps) {
  const {
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
  } = useContentForm({ mode, initial });

  return (
    <form className="admin-form" onSubmit={handleSave}>
      {error ? <p className="admin-error">{error}</p> : null}

      <ContentFormFields
        form={form}
        fileRef={fileRef}
        uploading={uploading}
        onFieldChange={updateField}
        onCoverUpload={handleCoverUpload}
      />

      <ContentFormToolbar
        mode={mode}
        form={form}
        initial={initial}
        saving={saving}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onDelete={handleDelete}
      />
    </form>
  );
}
