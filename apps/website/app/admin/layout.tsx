import "@ludecker/ui/tokens.css";
import "@ludecker/ui/button.css";
import "./admin.css";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-root">{children}</div>;
}
