'use client';

import { getRouteApi } from '@tanstack/react-router';
import { AdminHeader } from '@/src/admin/components/AdminHeader';
import { ContentFormatHint } from '@/src/admin/components/ContentFormatHint';
import { ContentForm } from '@/src/admin/components/ContentForm';

const adminEditRouteApi = getRouteApi('/admin/content/$id/edit');

export function EditContentPage() {
  const { content } = adminEditRouteApi.useLoaderData();

  return (
    <>
      <AdminHeader backHref="/admin" backLabel="← dashboard" />
      <main className="admin-main">
        <h1 className="admin-title">edit · {content.title.toLowerCase()}</h1>
        <p className="admin-table__meta">
          updated {new Date(content.updated_at).toLocaleString()}
        </p>
        <ContentFormatHint />
        <ContentForm mode="edit" initial={content} />
      </main>
    </>
  );
}
