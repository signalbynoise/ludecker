let generation = 0;

interface CacheEntry<T> {
  generation: number;
  value: T;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getPublicContentGeneration(): number {
  return generation;
}

export function readPublicContentCache<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry || entry.generation !== generation) {
    return undefined;
  }
  return entry.value as T;
}

export function writePublicContentCache<T>(key: string, value: T): T {
  store.set(key, { generation, value });
  return value;
}

export async function withPublicContentCache<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = readPublicContentCache<T>(key);
  if (cached !== undefined) {
    return cached;
  }
  const value = await fetcher();
  return writePublicContentCache(key, value);
}

/** Bumps generation so all memoized public reads refetch on next request. */
export function bumpPublicContentCache(): number {
  generation += 1;
  store.clear();
  return generation;
}
