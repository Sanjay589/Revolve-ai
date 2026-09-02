import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/policies',
        destination: '/settings',
        permanent: false,
      },
      {
        source: '/audit-trail',
        destination: '/audit',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
