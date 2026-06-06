import { describe, expect, it } from "vitest";
import { invalidatePublicContent } from "./invalidate-public";
import {
  bumpPublicContentCache,
  readPublicContentCache,
  withPublicContentCache,
  writePublicContentCache,
} from "./public-content-cache";

describe("public-content-cache", () => {
  it("returns cached value within the same generation", async () => {
    bumpPublicContentCache();
    let calls = 0;
    const fetcher = async () => {
      calls += 1;
      return "fresh";
    };

    await withPublicContentCache("test-key", fetcher);
    await withPublicContentCache("test-key", fetcher);

    expect(calls).toBe(1);
    expect(readPublicContentCache<string>("test-key")).toBe("fresh");
  });

  it("refetches after bumpPublicContentCache", async () => {
    bumpPublicContentCache();
    writePublicContentCache("test-key", "stale");

    bumpPublicContentCache();

    expect(readPublicContentCache("test-key")).toBeUndefined();
  });
});

describe("invalidatePublicContent", () => {
  it("bumps generation so memoized reads miss", async () => {
    bumpPublicContentCache();
    writePublicContentCache("slug:articles:demo", { title: "old" });

    invalidatePublicContent("articles", "demo");

    expect(readPublicContentCache("slug:articles:demo")).toBeUndefined();
  });
});
