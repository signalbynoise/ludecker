import { AdminHeader } from "@/app/admin/components/AdminHeader";
import { ContentFormatHint } from "@/app/admin/components/ContentFormatHint";
import { ContentForm } from "@/app/admin/components/ContentForm";

export default function NewContentPage() {
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
