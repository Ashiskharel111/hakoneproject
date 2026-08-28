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
};

export default nextConfig;
