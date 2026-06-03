import Link from "next/link";
import { notFound } from "next/navigation";
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
      <header className="admin-header">
        <Link href="/admin">← Dashboard</Link>
      </header>
      <main className="admin-main">
        <h1>Edit: {content.title}</h1>
        <ContentForm mode="edit" initial={content} />
      </main>
    </>
  );
}
