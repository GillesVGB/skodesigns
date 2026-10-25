import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
