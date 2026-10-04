import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  allowedDevOrigins: [
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
    '192.168.1.16',
    '192.168.1.16:3000',
    '192.168.*',
    '10.*',
    '172.*',
  ],
  async redirects() {
    return [
      { source: '/booking', destination: '/', permanent: true },
      { source: '/tours/:path*', destination: '/', permanent: true },
      { source: '/blog/:path*', destination: '/', permanent: true },
      { source: '/services/:path*', destination: '/', permanent: true },
      { source: '/destinations/:path*', destination: '/', permanent: true },
      { source: '/explore/:path*', destination: '/', permanent: true },
      { source: '/contact/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
