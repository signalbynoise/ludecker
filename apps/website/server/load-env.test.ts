import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadWebsiteEnv } from "./load-env";

describe("loadWebsiteEnv", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("loads Supabase credentials from .env.local", () => {
    const tempRoot = mkdtempSync(path.join(tmpdir(), "ludecker-env-"));
    writeFileSync(
      path.join(tempRoot, ".env.local"),
      [
        "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY=test-service-key",
      ].join("\n"),
    );

    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    loadWebsiteEnv(tempRoot);

    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe(
      "https://example.supabase.co",
    );
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBe("test-service-key");
  });
});
