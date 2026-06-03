import { createLogger } from "@ludecker/utils";

const log = createLogger("instrumentation");

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  log.info("register", "Next.js server starting", {
    nodeEnv: process.env.NODE_ENV,
    pid: process.pid,
    logLevel: process.env.LOG_LEVEL ?? "debug",
  });

  const missingEnv = [
    !process.env.NEXT_PUBLIC_SUPABASE_URL && "NEXT_PUBLIC_SUPABASE_URL",
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean);

  if (missingEnv.length > 0) {
    log.warn("register", "Missing environment variables", {
      missing: missingEnv,
    });
  }

  if (process.env.NODE_ENV === "development") {
    log.info("register", "Dev mode active — Fast Refresh enabled; restart after deleting .next");
  }
}
