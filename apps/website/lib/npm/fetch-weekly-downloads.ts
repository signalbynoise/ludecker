import { createLogger } from "@ludecker/utils";
import { NPM_AAAC, NPM_DOWNLOADS_CACHE_SECONDS } from "@/lib/constants";

const log = createLogger("npm:weekly-downloads");

const NPM_DOWNLOADS_API = "https://api.npmjs.org/downloads/range";

export interface NpmDownloadsDay {
  day: string;
  downloads: number;
}

export interface NpmDownloadsRangeResponse {
  downloads: NpmDownloadsDay[];
  package: string;
  start: string;
  end: string;
}

let cachedWeeklyTotal: { value: number; fetchedAt: number } | null = null;

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getRollingWeekDateRange(now = new Date()): {
  start: string;
  end: string;
} {
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  end.setUTCDate(end.getUTCDate() - 1);

  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);

  return { start: formatUtcDate(start), end: formatUtcDate(end) };
}

export function sumWeeklyDownloads(
  response: Pick<NpmDownloadsRangeResponse, "downloads">,
): number {
  return response.downloads.reduce((total, day) => total + day.downloads, 0);
}

export async function fetchWeeklyDownloads(
  fetchImpl: typeof fetch = fetch,
): Promise<number> {
  const cacheMs = NPM_DOWNLOADS_CACHE_SECONDS * 1000;
  if (
    cachedWeeklyTotal &&
    Date.now() - cachedWeeklyTotal.fetchedAt < cacheMs
  ) {
    log.debug("fetchWeeklyDownloads", "cache hit", {
      weeklyDownloads: cachedWeeklyTotal.value,
    });
    return cachedWeeklyTotal.value;
  }

  const { start, end } = getRollingWeekDateRange();
  const encodedPackage = encodeURIComponent(NPM_AAAC.name);
  const url = `${NPM_DOWNLOADS_API}/${start}:${end}/${encodedPackage}`;

  log.info("fetchWeeklyDownloads", "fetch start", { start, end, url });

  const response = await fetchImpl(url);
  if (!response.ok) {
    log.error("fetchWeeklyDownloads", "fetch failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(`npm downloads API returned ${response.status}`);
  }

  const payload = (await response.json()) as NpmDownloadsRangeResponse;
  const weeklyDownloads = sumWeeklyDownloads(payload);

  cachedWeeklyTotal = { value: weeklyDownloads, fetchedAt: Date.now() };

  log.info("fetchWeeklyDownloads", "fetch success", {
    weeklyDownloads,
    start,
    end,
  });

  return weeklyDownloads;
}

export function resetWeeklyDownloadsCacheForTests(): void {
  cachedWeeklyTotal = null;
}
