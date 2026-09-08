import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-config";
import { getSiteAccess } from "@/lib/repositories/site-access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = getSiteUrl();
  const siteAccess = await getSiteAccess();

  if (siteAccess.maintenanceMode) {
    return {
      rules: {
        userAgent: "*",
        allow: ["/impressum", "/datenschutz"],
        disallow: ["/"],
      },
      sitemap: new URL("/sitemap.xml", siteUrl).toString(),
      host: siteUrl,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login/", "/api/auth/", "/api/admin/"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl,
  };
}
