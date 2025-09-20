import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Configuración corregida para Next.js 15
  serverExternalPackages: ['prisma', '@prisma/client'],
};

export default nextConfig;
