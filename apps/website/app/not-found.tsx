import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell__main">
      <h1 className="content-hero__title">Page not found</h1>
      <p>
        <Link href="/">Return home</Link>
      </p>
    </main>
  );
}
