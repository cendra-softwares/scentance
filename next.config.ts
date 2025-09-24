import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;