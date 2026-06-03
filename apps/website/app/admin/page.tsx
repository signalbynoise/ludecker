import Link from "next/link";
import { LogoutButton } from "@/app/admin/components/LogoutButton";
import { fetchAllContentForAdmin } from "@/lib/content/admin-queries";

export default async function AdminDashboardPage() {
  const items = await fetchAllContentForAdmin();

  return (
    <>
      <header className="admin-header">
        <div>
          <Link href="/admin">CMS</Link>
        </div>
        <div className="admin-actions">
          <Link href="/admin/content/new" className="admin-button admin-button--primary">
            New content
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="admin-main">
        <h1>Content</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/admin/content/${item.id}/edit`}>
                    {item.title}
                  </Link>
                </td>
                <td>{item.article_type}</td>
                <td>
                  <span
                    className={`admin-status admin-status--${item.status}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{new Date(item.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? (
          <p>No content yet. Create your first entry.</p>
        ) : null}
      </main>
    </>
  );
}
