import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ─── Standalone output for Docker containerization ───────────────────────────
  output: 'standalone',

  // ─── Compiler optimizations ──────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ─── Compression ─────────────────────────────────────────────────────────────
  compress: true,

  // ─── Image optimization ───────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,  // 24h CDN cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // ─── HTTP caching headers tuned for 50k-100k RPM ─────────────────────────────
  async headers() {
    return [
      // Static assets: long-lived CDN cache
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      // API routes: short-lived smart cache + stale-while-revalidate
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=60' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      // Pages: edge-cacheable
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // ─── Redirects & rewrites ─────────────────────────────────────────────────────
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Proxy API calls to backend service if needed
      fallback: [
        // { source: '/api/v2/:path*', destination: 'http://backend-service:8080/api/:path*' },
      ],
    };
  },

  // ─── Experimental performance features ───────────────────────────────────────
  experimental: {
    // Inline CSS for critical path
    optimizeCss: false,  // requires critters — enable after install
    // Parallel server compilation
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  // ─── Webpack bundle optimizations ────────────────────────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree shaking: only import used icons from lucide
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    // Split into smaller chunks for better CDN cache hit rates
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,   // ~244KB max chunk
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },

  // ─── Power users options ──────────────────────────────────────────────────────
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;
