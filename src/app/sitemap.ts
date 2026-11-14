import { siteIndexable } from "@/lib/seo";
import type { MetadataRoute } from "next";
import { brand } from "@/lib/content";
import { resources } from "@/server/repository";
import { lessonTracks } from "@/lib/lesson-tracks";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteIndexable) return [];
  const articles = await resources();
  return [
    "",
    "/about",
    "/lessons",
    "/pricing",
    "/book",
    "/learn",
    "/contact",
    "/ciao",
    "/faq",
    "/blog",
    ...lessonTracks.map((t) => "/lessons/" + t.slug),
    ...articles.map((r) => "/learn/" + r.id),
  ].map((path) => ({ url: brand.siteUrl + path }));
}
