import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["@ludecker/types", "@ludecker/utils", "@ludecker/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      mermaid: path.join(configDir, "node_modules/mermaid"),
    };

    if (dev && isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "!**/node_modules/@ludecker/**"],
      };
    }

    return config;
  },
};

export default nextConfig;
