import { CONTACT_EMAIL } from './constants';
export function Footer() {
  return (
    <footer className="site-footer">
      <a className="site-footer__email" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    </footer>
  );
}
