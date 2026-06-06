'use client';

import { buttonVariants, cn } from '@ludecker/ui';
import { getRouteApi } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { AdminHeader } from '@/src/admin/components/AdminHeader';
import { ContentList } from '@/src/admin/components/ContentList';
import { LogoutButton } from '@/src/admin/components/LogoutButton';

const adminIndexRouteApi = getRouteApi('/admin/');

export function AdminDashboardPage() {
  const { items } = adminIndexRouteApi.useLoaderData();

  return (
    <>
      <AdminHeader
        actions={
          <>
            <Link
              to="/admin/content/new"
              className={cn(buttonVariants({ variant: 'default' }))}
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
        <Link className="admin-footer-link" to="/">
          ← site
        </Link>
      </main>
    </>
  );
}
