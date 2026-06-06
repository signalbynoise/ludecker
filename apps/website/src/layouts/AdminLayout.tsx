'use client';

import { TEXT_BODY_CLASS } from '@ludecker/ui';
import { Outlet } from '@tanstack/react-router';
import '@/src/styles/admin.css';

export function AdminLayout() {
  return (
    <div className={`${TEXT_BODY_CLASS} admin-root`}>
      <Outlet />
    </div>
  );
}
