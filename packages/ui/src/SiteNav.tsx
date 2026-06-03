import { NAV_ITEMS } from '@ludecker/types';
import { TEXT_BODY_CLASS } from './constants';
export interface SiteNavProps {
  activeId?: string;
}

export function SiteNav({ activeId }: SiteNavProps) {
  return (
    <nav className="site-nav" aria-label="Site">
      <ul className="site-nav__list">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} className="site-nav__item">
              <a
                className={
                  isActive
                    ? `${TEXT_BODY_CLASS} site-nav__link site-nav__link--active`
                    : `${TEXT_BODY_CLASS} site-nav__link`
                }
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
