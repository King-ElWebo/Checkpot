import type { MetadataRoute } from "next";

import { seoRoutes, siteUrl } from "@/content/fixtures/checkpot";
import { listPublishedBrands } from "@/lib/repositories/brands";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticRoutes = seoRoutes
    .filter((route) => route.index)
    .map((route) => ({
      url: new URL(route.canonical, siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.route === "/" ? 1 : 0.75,
    }));

  const dbBrands = await listPublishedBrands();
  const brandRoutes = dbBrands.map((brand) => ({
    url: new URL(`/marken/${brand.slug}`, siteUrl).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...brandRoutes];
}
