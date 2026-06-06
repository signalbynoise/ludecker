import { AdminHeader } from '@/src/admin/components/AdminHeader';
import { ContentFormatHint } from '@/src/admin/components/ContentFormatHint';
import { ContentForm } from '@/src/admin/components/ContentForm';

export function NewContentPage() {
  return (
    <>
      <AdminHeader backHref="/admin" backLabel="← dashboard" />
      <main className="admin-main">
        <h1 className="admin-title">new content</h1>
        <ContentFormatHint />
        <ContentForm mode="create" />
      </main>
    </>
  );
}
