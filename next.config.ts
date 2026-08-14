import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/team",
        destination: "/ueber-uns",
        statusCode: 301,
      },
      {
        source: "/brands",
        destination: "/marken",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
