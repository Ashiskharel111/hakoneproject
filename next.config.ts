import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
