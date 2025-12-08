import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import { withIntlayer } from "next-intlayer/server";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  // Disable turbopack for Intlayer compatibility
  // turbopack: {},
  // Fix for Intlayer compatibility issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules in browser environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

export default withIntlayer(withPWA(nextConfig));
