import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow cross-origin requests for dev (mobile on LAN / Wi-Fi)
  allowedDevOrigins: [
    '172.16.2.60',
    '172.16.2.60:3000',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
    '*.trycloudflare.com',
    'exempt-prostores-door-prior.trycloudflare.com',
  ],

  // Standalone output for Docker & Coolify container deployment
  output: 'standalone',

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
