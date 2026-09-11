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
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://econoben.dev',
  },

  // Customize build output
  distDir: process.env.BLOG_BUILD_DIR || '.next',

  // This is a standalone app; unrelated parent lockfiles must not widen traces.
  outputFileTracingRoot: __dirname,

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
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/api/og',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/posts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      ...['/social/:path*', '/icons/:path*', '/favicon.ico', '/manifest.json'].map(source => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      })),
      {
        source: '/rss.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
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
        source: '/posts/extending_%22GPTs_Are_GPTs%22_to_Firms',
        destination: '/posts/extending-gpts-are-gpts-to-firms',
        permanent: true,
      },
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
