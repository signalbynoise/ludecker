import Link from "next/link";
import { TEXT_BODY_CLASS } from "@ludecker/ui";

export default function NotFound() {
  return (
    <main className="page-shell__main">
      <h1 className={TEXT_BODY_CLASS}>Page not found</h1>
      <p className={TEXT_BODY_CLASS}>
        <Link href="/">Return home</Link>
      </p>
    </main>
  );
}
