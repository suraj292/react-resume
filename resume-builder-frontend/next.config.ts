/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static Export Configuration for Shared Hosting
  output: 'export',
  trailingSlash: true,

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Production optimizations
  reactStrictMode: true,

  // Headers for caching (only applies when using custom server)
  // These won't work with static export, configure via .htaccess instead
  async headers() {
    return [
      {
        // Cache images for 1 year
        source: '/:path*\\.(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static files for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts for 1 year
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache OG images for 1 week
        source: '/og-:filename.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Note: rewrites don't work with static export
  // API calls should use full URL (configured in .env.production)
};

export default nextConfig;

