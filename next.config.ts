import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network mobile devices to access Next.js dev server assets
  allowedDevOrigins: [
    '192.168.1.14',
    '192.168.*',
    '10.*',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;
