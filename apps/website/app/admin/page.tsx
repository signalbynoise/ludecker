import Link from "next/link";
import { buttonClassName } from "@ludecker/ui";
import { compareContentForAdmin } from "@ludecker/types";
import { AdminHeader } from "@/app/admin/components/AdminHeader";
import { ContentList } from "@/app/admin/components/ContentList";
import { LogoutButton } from "@/app/admin/components/LogoutButton";
import { fetchAllContentForAdmin } from "@/lib/content/admin-queries";

export default async function AdminDashboardPage() {
  const items = [...(await fetchAllContentForAdmin())].sort(
    compareContentForAdmin,
  );

  return (
    <>
      <AdminHeader
        actions={
          <>
            <Link
              href="/admin/content/new"
              className={buttonClassName("primary")}
            >
              New content
            </Link>
            <LogoutButton />
          </>
        }
      />
      <main className="admin-main">
        <h1 className="admin-title">content</h1>
        {items.length === 0 ? (
          <p className="admin-empty">No content yet. Create your first entry.</p>
        ) : (
          <ContentList items={items} />
        )}
        <Link className="admin-footer-link" href="/">
          ← site
        </Link>
      </main>
    </>
  );
}
