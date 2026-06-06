import { TEXT_BODY_CLASS } from '@ludecker/ui';
import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <main className="page-shell__main">
      <h1 className={TEXT_BODY_CLASS}>Page not found</h1>
      <p className={TEXT_BODY_CLASS}>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
}
