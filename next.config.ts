import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
    ],
  },
  // Required for mssql in serverless environments
  serverExternalPackages: ["mssql"],
};

export default nextConfig;
