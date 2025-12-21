import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "eexvyaxvqspovaddpbwk.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cdn.beacons.ai",
      },
    ],
  },

  // ============================================
  // DOMAIN ROUTING - Handled by middleware.ts
  // ============================================
  // Custom domain routing (mirrabelle13.online, bites.bio) is now
  // handled by middleware.ts for better control and reliability.
};

export default nextConfig;




