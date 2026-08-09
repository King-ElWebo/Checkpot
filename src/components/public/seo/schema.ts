import { siteUrl, storeDetails } from "@/content/fixtures/checkpot";
import type { BreadcrumbItem } from "@/lib/contracts/public";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeDetails.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeDetails.address.street,
      postalCode: storeDetails.address.postalCode,
      addressLocality: storeDetails.address.city,
      addressCountry: storeDetails.address.country,
    },
    telephone: storeDetails.phone,
    openingHoursSpecification: storeDetails.hours
      .filter((hour) => hour.schemaDays && hour.opens && hour.closes)
      .map((hour) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hour.schemaDays,
        opens: hour.opens,
        closes: hour.closes,
      })),
    url: siteUrl,
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}
