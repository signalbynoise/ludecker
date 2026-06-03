import { CONTACT_EMAIL, TEXT_BODY_CLASS } from './constants';
export function Footer() {
  return (
    <footer className="site-footer">
      <a className={`${TEXT_BODY_CLASS} site-footer__email`} href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    </footer>
  );
}
