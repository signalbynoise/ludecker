import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { createLogger } from "@ludecker/utils";

const log = createLogger("server:load-env");

const envFiles = [".env", ".env.local"] as const;

export function loadWebsiteEnv(websiteRoot: string): void {
  for (const fileName of envFiles) {
    const filePath = path.join(websiteRoot, fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    const result = config({
      path: filePath,
      override: fileName === ".env.local",
    });
    if (result.error) {
      log.error("loadWebsiteEnv", `Failed to read ${fileName}`, {
        message: result.error.message,
      });
      continue;
    }

    log.debug("loadWebsiteEnv", `Loaded ${fileName}`, {
      keyCount: Object.keys(result.parsed ?? {}).length,
    });
  }
}

const websiteRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

loadWebsiteEnv(websiteRoot);
