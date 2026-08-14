import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { brands, getBrandBySlug, getRelatedBrands, siteUrl } from "@/content/fixtures/checkpot";

export function generateStaticParams() {
  return brands.filter((b) => b.active).map((brand) => ({
    slug: brand.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const brand = getBrandBySlug(params.slug);
  
  if (!brand) {
    return {
      title: "Marke nicht gefunden",
    };
  }

  return {
    title: `${brand.name} Kollektion`,
    description: brand.summary,
    alternates: {
      canonical: `/marken/${brand.slug}`,
    },
    openGraph: {
      images: [{ url: brand.image.src }],
    },
  };
}

export default function BrandDetailPage({ params }: { params: { slug: string } }) {
  const brand = getBrandBySlug(params.slug);

  if (!brand) {
    notFound();
  }

  const relatedBrands = getRelatedBrands(brand);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    description: brand.summary,
    url: new URL(`/marken/${brand.slug}`, siteUrl).toString(),
    image: new URL(brand.image.src, siteUrl).toString(),
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
            <p className="mb-10 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
              {brand.summary}
            </p>

            <div className="space-y-6 text-[15px] leading-relaxed text-[#4A5568]">
              <p>{brand.detail}</p>
            </div>

            <div className="mt-16 rounded-md bg-[#F9F9F8] p-8">
              <h3 className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                Beratung im Geschäft
              </h3>
              <p className="mb-8 text-[15px] leading-relaxed text-[#4A5568]">{brand.note}</p>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Termin vereinbaren
              </Link>
            </div>
          </div>

          <FadeIn className="lg:sticky lg:top-32 lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
              <Image
                src={brand.image.src}
                alt={brand.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: brand.image.objectPosition }}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {relatedBrands.length > 0 && (
        <section className="bg-white border-t border-[#E2E8F0] px-4 py-20 lg:px-6 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 text-center lg:mb-16">
              <span className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
                Inspiration
              </span>
              <h2 className="text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
                Das könnte Ihnen auch gefallen
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedBrands.map((related) => (
                <Link
                  key={related.slug}
                  href={`/marken/${related.slug}`}
                  className="group flex flex-col justify-between rounded-md bg-[#F9F9F8] p-8 transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  <div>
                    <h3 className="text-2xl font-normal tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#C01718] lg:text-3xl">
                      {related.name}
                    </h3>
                    <div className="mt-5 h-[1px] w-12 bg-[#E2E8F0] transition-colors group-hover:bg-[#C01718]/30" />
                    <p className="mt-5 text-[15px] leading-relaxed text-[#4A5568]">
                      {related.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/marken"
                className="group inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                Alle Marken ansehen <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
