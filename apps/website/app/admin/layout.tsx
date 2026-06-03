import "@ludecker/ui/tokens.css";
import "@ludecker/ui/typography.css";
import "@ludecker/ui/button.css";
import { TEXT_BODY_CLASS } from "@ludecker/ui";
import "./admin.css";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${TEXT_BODY_CLASS} admin-root`}>{children}</div>;
}
