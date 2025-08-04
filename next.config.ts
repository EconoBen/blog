import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['econoben.dev', 'tech-notes-blog.s3.us-west-2.amazonaws.com'],
  },
  async headers() {
    return [
      {
        source: '/api/og',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png',
          },
          {
            key: 'Cache-Control',
            value: 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/workshop',
        destination: '/code-ai',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;