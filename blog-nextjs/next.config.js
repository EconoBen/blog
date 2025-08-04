/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Configure webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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
    domains: ['your-s3-bucket.s3.amazonaws.com'], // Add your S3 bucket domain
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Customize build output
  distDir: '.next',

  // Enable compression
  compress: true,

  // Configure headers for security
  async headers() {
    return [
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

  // Redirects for old routes (if needed)
  async redirects() {
    return [
      // Example: redirect old workshop routes to new code-ai routes
      {
        source: '/workshop/:slug',
        destination: '/code-ai/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;