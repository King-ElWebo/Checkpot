import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { getPublishedBrandBySlug, listPublishedBrands } from "@/lib/repositories/brands";
import { getOutfitsByBrandId } from "@/lib/repositories/outfits";
import { siteUrl } from "@/content/fixtures/checkpot";

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

  return {
    title: `${brand.name} Kollektion`,
    description: `Aktuelle Kollektion von ${brand.name} bei Checkpot in Wien Hietzing entdecken.`,
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
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
            { label: brand.name, href: `/marken/${brand.slug}` as import("@/lib/contracts/public").PublicRoute },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col lg:col-span-5 lg:col-start-2">
            <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
              Marke
            </span>
            <h1 className="mb-8 text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
              {brand.name}
            </h1>
            {brand.summary && (
              <p className="mb-10 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
                {brand.summary}
              </p>
            )}

            {brand.description && (
              <div className="space-y-6 text-[15px] leading-relaxed text-[#4A5568]">
                <p>{brand.description}</p>
              </div>
            )}

            <div className="mt-16 rounded-md bg-[#F9F9F8] p-8">
              <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                Beratung im Geschäft
              </h3>
              <p className="mb-8 text-[15px] leading-relaxed text-[#4A5568]">
                Wir beraten Sie gerne persönlich zu den Stücken von {brand.name}. Besuchen Sie uns in Wien Hietzing.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Termin vereinbaren
              </Link>
            </div>
          </div>

          {brand.image && (
            <FadeIn className="lg:sticky lg:top-32 lg:col-span-5 lg:col-start-8">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
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

      {relatedOutfits.length > 0 && (
        <section className="bg-white border-t border-[#E2E8F0] px-4 py-20 lg:px-6 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 text-center lg:mb-16">
              <span className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
                Inspiration
              </span>
              <h2 className="text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
                Outfits von {brand.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="group flex flex-col justify-between rounded-md bg-[#F9F9F8] overflow-hidden transition-colors duration-150 ease-out hover:bg-[#E2E8F0]"
                >
                  {outfit.media && (
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                       <Image
                        src={outfit.media.url}
                        alt={outfit.media.alt || outfit.title}
                        fill
                        className="object-cover transition-transform duration-400 ease-out group-hover:scale-[1.02]"
                        style={{ objectPosition: outfit.media.focalPoint || "center" }}
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-normal tracking-tight text-[#1A1A1A] lg:text-3xl">
                      {outfit.title}
                    </h3>
                    <div className="mt-5 h-[1px] w-12 bg-[#E2E8F0]" />
                    {outfit.note && (
                      <p className="mt-5 text-[15px] leading-relaxed text-[#4A5568]">
                        {outfit.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/outfits"
                className="group inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                Alle Outfits ansehen <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
