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
        hostname: "rsdfmvfpopwilizrywfx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cdn.beacons.ai",
      },
    ],
  },

  // ============================================
  // DOMAIN ROUTING CONFIGURATION
  // ============================================
  // This allows multiple domains to work with the same Vercel project:
  // - lovebite.fans (main domain)
  // - bites.bio (short bio links)
  // - mirrabelle13.online (custom creator domain)
  
  async redirects() {
    return [
      // 1) Root of bites.bio -> lovebite.fans
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'bites.bio',
          },
        ],
        destination: 'https://lovebite.fans',
        permanent: true,
      },

      // 2) Any non-root path on mirrabelle13.online -> root of that domain
      //    e.g. /test, /foo/bar -> https://mirrabelle13.online/
      {
        source: '/:path+',
        has: [
          {
            type: 'host',
            value: 'mirrabelle13.online',
          },
        ],
        destination: 'https://mirrabelle13.online/',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // 3) bites.bio/mirrabelle13 -> use the profile page at /creator/mirrabelle13
      //    URL stays bites.bio/mirrabelle13, but content is from /creator/mirrabelle13
      {
        source: '/mirrabelle13',
        has: [
          {
            type: 'host',
            value: 'bites.bio',
          },
        ],
        destination: '/creator/mirrabelle13',
      },

      // 4) mirrabelle13.online root -> /creator/mirrabelle13 in the same app
      //    URL stays mirrabelle13.online, content from /creator/mirrabelle13
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'mirrabelle13.online',
          },
        ],
        destination: '/creator/mirrabelle13',
      },

      // ===== ADD MORE CREATOR CUSTOM DOMAINS HERE =====
      // Example for another creator:
      // {
      //   source: '/',
      //   has: [{ type: 'host', value: 'anothercreator.com' }],
      //   destination: '/creator/anothercreator',
      // },
    ];
  },
};

export default nextConfig;




