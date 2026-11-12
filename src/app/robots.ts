import type { MetadataRoute } from "next";
import { brand } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api", "/login"],
    },
    sitemap: brand.siteUrl + "/sitemap.xml",
  };
}
