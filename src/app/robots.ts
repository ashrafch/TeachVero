import { siteIndexable } from "@/lib/seo";
import type { MetadataRoute } from "next";
import { brand } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteIndexable
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/dashboard", "/api", "/login"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: siteIndexable ? brand.siteUrl + "/sitemap.xml" : undefined,
  };
}
