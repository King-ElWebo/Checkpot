import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/fixtures/checkpot";

export default function robots(): MetadataRoute.Robots {
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
