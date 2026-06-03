import Link from "next/link";
import { buttonClassName, Button } from "@ludecker/ui";
import { AdminHeader } from "@/app/admin/components/AdminHeader";
import { ContentRowActions } from "@/app/admin/components/ContentRowActions";
import { LogoutButton } from "@/app/admin/components/LogoutButton";
import { fetchAllContentForAdmin } from "@/lib/content/admin-queries";

export default async function AdminDashboardPage() {
  const items = await fetchAllContentForAdmin();

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
          <table className="admin-table">
            <thead>
              <tr>
                <th>title</th>
                <th>type</th>
                <th>status</th>
                <th>updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <ContentRowActions item={item} />
                  </td>
                  <td className="admin-table__meta">{item.article_type}</td>
                  <td>
                    <span
                      className={`admin-status admin-status--${item.status}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="admin-table__meta">
                    {new Date(item.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link className="admin-footer-link" href="/">
          ← site
        </Link>
      </main>
    </>
  );
}
