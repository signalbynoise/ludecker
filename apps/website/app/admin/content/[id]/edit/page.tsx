import { notFound } from "next/navigation";
import { AdminHeader } from "@/app/admin/components/AdminHeader";
import { ContentForm } from "@/app/admin/components/ContentForm";
import { fetchContentByIdForAdmin } from "@/lib/content/admin-queries";

interface EditContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: EditContentPageProps) {
  const { id } = await params;
  const content = await fetchContentByIdForAdmin(id);
  if (!content) notFound();

  return (
    <>
      <AdminHeader backHref="/admin" backLabel="← dashboard" />
      <main className="admin-main">
        <h1 className="admin-title">edit · {content.title.toLowerCase()}</h1>
        <ContentForm mode="edit" initial={content} />
      </main>
    </>
  );
}
