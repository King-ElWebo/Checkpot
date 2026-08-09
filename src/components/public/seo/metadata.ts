import type { Metadata } from "next";

import { seoRoutes, siteUrl } from "@/content/fixtures/checkpot";
import type { PublicRoute } from "@/lib/contracts/public";

const defaultSocialImage = "/customer/og-image.jpg";
const defaultDescription =
  "Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing. Nachhaltige Kollektionen und ausgewählte Marken.";

export function metadataFor(route: PublicRoute): Metadata {
  const routeSeo = seoRoutes.find((item) => item.route === route);

  if (!routeSeo) {
    return {};
  }

  const image = routeSeo.socialImage ?? defaultSocialImage;

  return {
    title: routeSeo.title,
    description: routeSeo.description || defaultDescription,
    alternates: {
      canonical: routeSeo.canonical,
    },
    robots: {
      index: routeSeo.index,
      follow: true,
      googleBot: {
        index: routeSeo.index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${routeSeo.title} | Checkpot Hietzing`,
      description: routeSeo.description,
      url: new URL(routeSeo.canonical, siteUrl).toString(),
      siteName: "Checkpot Hietzing",
      images: routeSeo.index
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: "Checkpot Hietzing Store Außenansicht",
            },
          ]
        : undefined,
      locale: "de_AT",
      type: "website",
    },
    twitter: routeSeo.index
      ? {
          card: "summary_large_image",
          title: `${routeSeo.title} | Checkpot Hietzing`,
          description: routeSeo.description,
          images: [image],
        }
      : undefined,
  };
}
