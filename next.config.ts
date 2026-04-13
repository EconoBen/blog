import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Configure webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Add support for importing markdown files as strings
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    // Add buffer polyfill for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
      };
      
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    return config;
  },

  // Configure image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'econoben.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tech-notes-blog.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Customize build output
  distDir: '.next',

  // Enable compression
  compress: true,

  // Add trailing slash for production parity
  trailingSlash: false,

  // Configure asset prefix for production
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',

  // Optimize static file serving
  generateEtags: true,

  // Configure headers for security and caching
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
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/posts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects for old routes
  async redirects() {
    return [
      {
        source: '/workshop',
        destination: '/code-ai',
        permanent: true,
      },
      {
        source: '/workshop/:slug',
        destination: '/code-ai/:slug',
        permanent: true,
      },
      {
        source: '/archives',
        destination: '/archive',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
