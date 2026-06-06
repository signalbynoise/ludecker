import { NAV_ITEMS } from '@ludecker/types';
import { normalizePathname } from '@/lib/routing/pathname';

export function resolveActiveNavId(pathname: string): string | undefined {
  const normalized = normalizePathname(pathname);

  if (normalized === '/') {
    return undefined;
  }

  const match = NAV_ITEMS.find((item) => {
    if (normalized === item.href) {
      return true;
    }

    if (item.href !== '/' && normalized.startsWith(`${item.href}/`)) {
      return true;
    }

    return false;
  });

  return match?.id;
}
