import type { NextConfig } from "next";

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
};

export default nextConfig;
