import { NAV_ITEMS } from '@ludecker/types';

export function resolveActiveNavId(pathname: string): string | undefined {
  if (pathname === '/') return undefined;

  const match = NAV_ITEMS.find((item) => {
    if (pathname === item.href) return true;
    if (item.href !== '/' && pathname.startsWith(`${item.href}/`)) return true;
    if (pathname.startsWith(`/${item.articleType}/`)) return true;
    return false;
  });

  return match?.id;
}

export function resolveHomeActive(pathname: string): boolean {
  return pathname === '/';
}
