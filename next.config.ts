import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Makes `env.DB` / `env.IMAGES` available inside `next dev`.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.scentenceparfum.in',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Force HTTPS (for production)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Restrict feature access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://mercury-uat.phonepe.com https://mercury.phonepe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://images.scentenceparfum.in https://js.stripe.com https://*.phonepe.com",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com https://api-preprod.phonepe.com https://api.phonepe.com",
              "frame-src 'self' https://js.stripe.com https://mercury-uat.phonepe.com https://mercury.phonepe.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
