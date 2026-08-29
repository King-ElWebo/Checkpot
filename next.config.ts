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
      // Core alias redirects
      { source: "/team", destination: "/ueber-uns", statusCode: 301 },
      { source: "/brands", destination: "/marken", statusCode: 301 },
      { source: "/home", destination: "/", statusCode: 301 },
      { source: "/home/checkpot_damenmoden_1130_wien_", destination: "/", statusCode: 301 },

      // About / Team / Store photos
      { source: "/ueber_uns", destination: "/ueber-uns", statusCode: 301 },
      { source: "/ueber_uns/unser_team", destination: "/ueber-uns", statusCode: 301 },
      { source: "/ueber_uns/fotos-vom-geschaeft", destination: "/ueber-uns", statusCode: 301 },

      // Contact / Legal
      { source: "/kontakt/kontakt", destination: "/kontakt", statusCode: 301 },
      { source: "/kontakt/impressum", destination: "/impressum", statusCode: 301 },
      { source: "/kontakt/datenschutz", destination: "/datenschutz", statusCode: 301 },

      // Mode & Collections
      { source: "/mode/unsere-marken", destination: "/marken", statusCode: 301 },
      { source: "/mode/fair_trade", destination: "/fair-trade", statusCode: 301 },
      { source: "/mode/vorschau-auf-herbst-winter-2025", destination: "/mode", statusCode: 301 },
      { source: "/mode/vorschau-auf-fruehjahr-sommer-2026", destination: "/mode", statusCode: 301 },
      { source: "/mode/vorschau-auf-fruehling-sommer-2025", destination: "/mode", statusCode: 301 },

      // Active Brand normalization
      { source: "/marken/king-louie-wien", destination: "/marken/king-louie", statusCode: 301 },
      { source: "/marken/madness-wien", destination: "/marken/madness", statusCode: 301 },
      { source: "/marken/angels-wien", destination: "/marken/angels", statusCode: 301 },
      { source: "/marken/sorgenfri-wien", destination: "/marken/sorgenfri", statusCode: 301 },
      { source: "/marken/emily-van-den-bergh-wien", destination: "/marken/emily-van-den-berg", statusCode: 301 },
      { source: "/marken/nomads-clothing-", destination: "/marken/nomads", statusCode: 301 },
    ];
  },
};

export default nextConfig;
