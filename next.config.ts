import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opt out bundling for problematic node_modules
  serverExternalPackages: ['pdf-parse', 'officeparser'],
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ]
  }
};

export default nextConfig;
