import type { MetadataRoute } from "next";

import { seoRoutes } from "@/content/fixtures/checkpot";
import { getSiteUrl } from "@/lib/site-config";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { getSiteAccess } from "@/lib/repositories/site-access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const siteAccess = await getSiteAccess();
  const lastModified = new Date();

  // If Coming Soon mode is active, only advertise legal pages to search engines
  if (siteAccess.maintenanceMode) {
    return [
      {
        url: new URL("/impressum", siteUrl).toString(),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: new URL("/datenschutz", siteUrl).toString(),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
    ];
  }

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
