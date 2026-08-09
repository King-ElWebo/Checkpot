import type { MetadataRoute } from "next";

import { brands, seoRoutes, siteUrl } from "@/content/fixtures/checkpot";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-09T00:00:00.000Z");
  const staticRoutes = seoRoutes
    .filter((route) => route.index)
    .map((route) => ({
      url: new URL(route.canonical, siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.route === "/" ? 1 : 0.75,
    }));

  const brandRoutes = brands
    .filter((brand) => brand.active)
    .map((brand) => ({
      url: new URL(`/marken/${brand.slug}`, siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  return [...staticRoutes, ...brandRoutes];
}
