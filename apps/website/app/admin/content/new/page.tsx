import Link from "next/link";
import { ContentForm } from "@/app/admin/components/ContentForm";

export default function NewContentPage() {
  return (
    <>
      <header className="admin-header">
        <Link href="/admin">← Dashboard</Link>
      </header>
      <main className="admin-main">
        <h1>New content</h1>
        <ContentForm mode="create" />
      </main>
    </>
  );
}
