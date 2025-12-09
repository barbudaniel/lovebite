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
  // - bites.bio / www.bites.bio (short bio links)
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
      // 1b) Root of www.bites.bio -> lovebite.fans
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.bites.bio',
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
      // 2b) Any non-root path on www.mirrabelle13.online -> root
      {
        source: '/:path+',
        has: [
          {
            type: 'host',
            value: 'www.mirrabelle13.online',
          },
        ],
        destination: 'https://www.mirrabelle13.online/',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // 3) bites.bio/:username -> /creator/:username (dynamic for any creator)
      //    URL stays bites.bio/username, but content is from /creator/username
      {
        source: '/:username',
        has: [
          {
            type: 'host',
            value: 'bites.bio',
          },
        ],
        destination: '/creator/:username',
      },
      // 3b) www.bites.bio/:username -> /creator/:username
      {
        source: '/:username',
        has: [
          {
            type: 'host',
            value: 'www.bites.bio',
          },
        ],
        destination: '/creator/:username',
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
      // 4b) www.mirrabelle13.online root -> /creator/mirrabelle13
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.mirrabelle13.online',
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




