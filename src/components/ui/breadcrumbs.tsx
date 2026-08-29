import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/contracts/public";
import { getSiteUrl } from "@/lib/site-config";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteUrl).toString(),
    })),
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 py-4">
        <ol className="flex items-center space-x-2 text-sm text-[#4A5568]">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-[#E2E8F0]" aria-hidden="true">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span
                  className="font-medium text-[#1A1A1A]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#1A1A1A] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
