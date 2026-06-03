import { Suspense } from "react";
import { LoginForm } from "@/app/admin/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="admin-main">
      <Suspense fallback={<p>Loading…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
