import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "down-vn.img.susercontent.com" },
    ],
  },
};

export default nextConfig;
