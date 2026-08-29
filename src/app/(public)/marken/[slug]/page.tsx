import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { getPublishedBrandBySlug, listPublishedBrands } from "@/lib/repositories/brands";
import { getOutfitsByBrandId } from "@/lib/repositories/outfits";
import { getSiteUrl } from "@/lib/site-config";


export async function generateStaticParams() {
  const brands = await listPublishedBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getPublishedBrandBySlug(slug);
  
  if (!brand) {
    return {
      title: "Marke nicht gefunden",
    };
  }

  // Avoid "Aktuelle Kollektion" unless verified.
  return {
    title: `${brand.name} bei Checkpot`,
    description: brand.summary || `${brand.name} bei Checkpot in Wien Hietzing entdecken.`,
    alternates: {
      canonical: `/marken/${brand.slug}`,
    },
    openGraph: {
      images: brand.image ? [{ url: brand.image.url }] : undefined,
    },
  };
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getPublishedBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const relatedOutfits = await getOutfitsByBrandId(brand.id);

  // We need to fetch all brands for the "Related Brands" section.
  // We'll just take 3 random/other brands for now to fulfill the 2-4 requirement,
  // making sure they are not the current brand.
  const allBrands = await listPublishedBrands();
  const relatedBrands = allBrands.filter(b => b.id !== brand.id).slice(0, 3);
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: new URL("/", siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Marken",
        item: new URL("/marken", siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.name,
        item: new URL(`/marken/${brand.slug}`, siteUrl).toString(),
      }
    ]
  };

  return (
    <div className="flex flex-col bg-[#F9F9F8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumbs Header */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
            { label: brand.name, href: `/marken/${brand.slug}` as import("@/lib/contracts/public").PublicRoute },
          ]}
        />
      </div>

      {/* A. BRAND HERO & INFO */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Brand Info (Left Side) */}
          <div className="flex flex-col lg:col-span-5 lg:col-start-1">
            {brand.logo ? (
              <div className="relative mb-10 h-16 w-3/4 max-w-[200px]">
                <Image
                  src={brand.logo.url}
                  alt={brand.logo.alt || brand.name}
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <h1 className="mb-10 font-display text-5xl text-[#1A1A1A] lg:text-7xl">
                {brand.name}
              </h1>
            )}

            {brand.summary && (
              <p className="mb-8 text-xl leading-relaxed text-[#1A1A1A] font-medium lg:text-2xl">
                {brand.summary}
              </p>
            )}

            {brand.description && (
              <div className="prose prose-lg prose-p:text-[#4A5568] prose-p:leading-relaxed mb-12">
                {/* Fallback to simple formatting since we don't have rich text */}
                {brand.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-sm bg-white p-8 border border-[#E2E8F0]">
              <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                Checkpot Hietzing
              </h3>
              <p className="mb-8 text-[15px] leading-relaxed text-[#4A5568]">
                Entdecken Sie ausgewählte Stücke von {brand.name} direkt bei uns im Geschäft. Wir beraten Sie gerne persönlich zu Passform und Kombinationen.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Besuch planen
              </Link>
            </div>
          </div>

          {/* Brand Imagery (Right Side) */}
          {brand.image && (
            <FadeIn className="lg:sticky lg:top-32 lg:col-span-6 lg:col-start-7">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#E2E8F0]">
                <Image
                  src={brand.image.url}
                  alt={brand.image.alt || brand.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: brand.image.focalPoint || "center" }}
                />
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* D. OUTFITS WITH THIS BRAND */}
      <section className="bg-white border-t border-[#E2E8F0] px-4 py-20 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 md:flex md:items-end md:justify-between lg:mb-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl text-[#1A1A1A] lg:text-5xl">
                Checkpot x {brand.name}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[#4A5568]">
                So kombinieren wir die Stücke von {brand.name}. Inspiration direkt aus unserem Geschäft in Hietzing.
              </p>
            </div>
          </div>
          
          {relatedOutfits.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {relatedOutfits.map((outfit, index) => {
                const isFeatured = index % 4 === 0 && relatedOutfits.length > 3; // Feature occasionally if many outfits
                return (
                  <Link
                    key={outfit.id}
                    href="/outfits"
                    className={`group flex flex-col focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4 ${
                      isFeatured ? "md:col-span-2 lg:col-span-2" : ""
                    }`}
                  >
                    {outfit.media && (
                      <div className={`relative mb-6 w-full overflow-hidden rounded-sm bg-[#F9F9F8] ${
                        isFeatured ? "aspect-[16/9] lg:aspect-[3/2]" : "aspect-[4/5]"
                      }`}>
                        <Image
                          src={outfit.media.url}
                          alt={outfit.media.alt || outfit.title}
                          fill
                          sizes={isFeatured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          style={{ objectPosition: outfit.media.focalPoint || "center" }}
                        />
                      </div>
                    )}
                    <h3 className="mb-3 font-display text-2xl text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                      {outfit.title}
                    </h3>
                    {outfit.note && (
                      <p className="text-[15px] leading-relaxed text-[#4A5568] line-clamp-2">
                        {outfit.note}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E2E8F0] bg-[#F9F9F8] py-24 text-center">
              <p className="mb-6 text-lg text-[#4A5568]">
                Aktuell haben wir keine spezifischen Outfits mit {brand.name} digitalisiert.
              </p>
              <Link
                href="/outfits"
                className="inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Alle Outfits ansehen <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* F. RELATED BRANDS */}
      {relatedBrands.length > 0 && (
        <section className="bg-[#F9F9F8] border-t border-[#E2E8F0] px-4 py-20 lg:px-6 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="mb-12 font-display text-3xl text-[#1A1A1A] lg:text-4xl text-center">
              Weitere Marken entdecken
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBrands.map((relatedBrand) => (
                <Link
                  key={relatedBrand.slug}
                  href={`/marken/${relatedBrand.slug}`}
                  className="group flex flex-col items-center justify-center rounded-sm bg-white p-12 text-center transition-shadow hover:shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  {relatedBrand.logo ? (
                    <div className="relative mb-6 h-12 w-full max-w-[140px] opacity-70 transition-opacity group-hover:opacity-100">
                      <Image
                        src={relatedBrand.logo.url}
                        alt={relatedBrand.logo.alt || relatedBrand.name}
                        fill
                        className="object-contain object-center"
                      />
                    </div>
                  ) : (
                    <h3 className="mb-4 font-display text-2xl text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                      {relatedBrand.name}
                    </h3>
                  )}
                  <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#4A5568] transition-colors group-hover:text-[#C01718]">
                    Entdecken <span aria-hidden="true" className="ml-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
