import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  serverExternalPackages: ["@prisma/client"],
  async redirects() {
    return [
      { source: "/packages", destination: "/pricing", permanent: false },
      { source: "/free-learning", destination: "/learn", permanent: true },
      {
        source: "/free-learning/:slug",
        destination: "/learn/:slug",
        permanent: true,
      },
      { source: "/blog/:slug", destination: "/learn/:slug", permanent: true },
      ...["privacy", "cookies", "terms"].map((slug) => ({
        source: "/" + slug,
        destination: "/legal/" + slug,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
