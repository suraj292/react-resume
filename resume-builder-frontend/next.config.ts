/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone build for VPS deployment with Node.js
  output: 'standalone',

  // Enable trailing slashes for better compatibility
  trailingSlash: true,

  // Image optimization (can be enabled on VPS)
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },

  // Compression
  compress: true,

  // Production optimizations
  reactStrictMode: true,

  // Disable powered by header for security
  poweredByHeader: false,
};

export default nextConfig;
