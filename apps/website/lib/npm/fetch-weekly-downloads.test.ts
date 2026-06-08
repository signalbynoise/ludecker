import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchWeeklyDownloads,
  getRollingWeekDateRange,
  resetWeeklyDownloadsCacheForTests,
  sumWeeklyDownloads,
} from "./fetch-weekly-downloads";

describe("getRollingWeekDateRange", () => {
  it("returns a seven-day window ending yesterday UTC", () => {
    const now = new Date("2026-06-08T12:00:00.000Z");
    expect(getRollingWeekDateRange(now)).toEqual({
      start: "2026-06-01",
      end: "2026-06-07",
    });
  });
});

describe("sumWeeklyDownloads", () => {
  it("sums daily download counts", () => {
    expect(
      sumWeeklyDownloads({
        downloads: [
          { day: "2026-06-01", downloads: 100 },
          { day: "2026-06-02", downloads: 200 },
          { day: "2026-06-03", downloads: 50 },
        ],
      }),
    ).toBe(350);
  });
});

describe("fetchWeeklyDownloads", () => {
  afterEach(() => {
    resetWeeklyDownloadsCacheForTests();
    vi.unstubAllGlobals();
  });

  it("fetches and caches the weekly total", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        downloads: [
          { day: "2026-06-01", downloads: 400 },
          { day: "2026-06-02", downloads: 163 },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchWeeklyDownloads()).resolves.toBe(563);
    await expect(fetchWeeklyDownloads()).resolves.toBe(563);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
