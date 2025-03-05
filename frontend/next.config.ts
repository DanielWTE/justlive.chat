import type { NextConfig } from "next";
import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../.env") });

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
