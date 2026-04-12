import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' data: blob: https://lh3.googleusercontent.com https://lhzznzgikawaybpgziff.supabase.co;
  font-src 'self' data: https:;
  connect-src 'self' https://lhzznzgikawaybpgziff.supabase.co https://accounts.google.com https:;
  frame-src https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\n/g, "").replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "officeparser"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lhzznzgikawaybpgziff.supabase.co",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },

          { key: "X-DNS-Prefetch-Control", value: "on" },

          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), usb=(), payment=(), interest-cohort=()",
          },

          // lebih aman & kompatibel
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;