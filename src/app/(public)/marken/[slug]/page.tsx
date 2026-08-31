import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata, Route } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { getPublishedBrandBySlug, listPublishedBrands, getAdditionalPublishedBrands } from "@/lib/repositories/brands";
import { getOutfitsByBrandId } from "@/lib/repositories/outfits";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const title = brand.seoMetadata?.title?.trim() || `${brand.name} bei Checkpot`;
  const description =
    brand.seoMetadata?.description?.trim() ||
    brand.summary?.trim() ||
    `${brand.name} bei Checkpot in Wien Hietzing entdecken.`;

  const ogTitle = brand.seoMetadata?.ogTitle?.trim() || title;
  const ogDescription = brand.seoMetadata?.ogDescription?.trim() || description;

  return {
    title,
    description,
    alternates: {
      canonical: `/marken/${brand.slug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
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

  const rawRelatedOutfits = await getOutfitsByBrandId(brand.id);
  const relatedOutfits = rawRelatedOutfits.slice(0, 4);
  const additionalBrands = await getAdditionalPublishedBrands(brand.id, 3);
  return (
    <div className="flex flex-col bg-white">
      {/* 1. QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-6 pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
            { label: brand.name, href: `/marken/${brand.slug}` as import("@/lib/contracts/public").PublicRoute },
          ]}
        />
      </div>

      {/* 2. COMPACT EDITORIAL BRAND HERO */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-4 pb-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.25fr] gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left: Brand Identity & Summary */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Bei Checkpot in Wien-Hietzing
              </span>
            </div>

            {brand.logo ? (
              <div className="flex flex-col mb-4">
                <div className="relative h-12 sm:h-14 w-44 max-w-[200px] mb-3">
                  <Image
                    src={brand.logo.url}
                    alt={brand.logo.alt || brand.name}
                    fill
                    priority
                    className="object-contain object-left"
                  />
                </div>
                <h1 className="sr-only">{brand.name}</h1>
              </div>
            ) : (
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] 2xl:text-[60px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-4">
                {brand.name}
              </h1>
            )}

            {brand.summary && (
              <p className="text-[17px] sm:text-[19px] 2xl:text-[21px] text-[#4A5568] leading-relaxed max-w-xl">
                {brand.summary}
              </p>
            )}
          </FadeIn>

          {/* Right: Brand Visual or Intentional Typographic Fallback */}
          <FadeIn delay={120} duration={600} translateY={16} className="relative">
            {brand.image?.url ? (
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[500px] 2xl:max-h-[560px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
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
            ) : (
              /* Intentional Typographic Brand Fallback Panel */
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[500px] 2xl:max-h-[560px] w-full rounded-sm overflow-hidden bg-[#F6F4EE] border border-[#E5E2DC] shadow-[0_16px_40px_rgba(0,0,0,0.03)] p-8 sm:p-12 flex flex-col justify-between select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C01718]" aria-hidden="true" />
                  <span className="text-[11.5px] font-mono font-medium tracking-wider text-[#718096]">
                    LABEL · WIEN-HIETZING
                  </span>
                </div>

                <div className="text-center px-4 py-8">
                  <span className="font-display text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight tracking-tight text-[#1A1A1A] block">
                    {brand.name}
                  </span>
                </div>

                <div className="text-center border-t border-[#E5E2DC] pt-3.5">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#718096] font-medium block">
                    Bei Checkpot · Hietzing
                  </span>
                </div>
              </div>
            )}
          </FadeIn>

        </div>
      </section>

      {/* 3. BRAND STORY & VERIFIED CLAIMS (GUT ZU WISSEN) */}
      {(brand.description || (brand.verifiedClaims && brand.verifiedClaims.length > 0)) && (
        <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-16 lg:py-22 px-6 lg:px-8 2xl:px-12">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-12 lg:gap-16 xl:gap-20 items-start">
              
              {/* Left Column: Story & Description */}
              <div>
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2">
                  {`Das ist ${brand.name}`}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] mb-6 tracking-tight">
                  Stil & Handschrift
                </h2>

                {brand.description && (
                  <div className="space-y-4 text-[16px] sm:text-[17px] leading-relaxed text-[#4A5568] max-w-xl">
                    {brand.description.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Verified Claims (Gut zu wissen) */}
              {brand.verifiedClaims && brand.verifiedClaims.length > 0 && (
                <div className="bg-white border border-[#EDEAE4] rounded-sm p-6 sm:p-8">
                  <h3 className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A] mb-4 pb-3 border-b border-[#EDEAE4]">
                    Gut zu wissen
                  </h3>
                  <div className="divide-y divide-[#EDEAE4]">
                    {brand.verifiedClaims.map((claim, idx) => (
                      <div key={idx} className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3">
                        <span className="text-[11.5px] font-mono font-semibold text-[#C01718] shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[14.5px] leading-relaxed text-[#4A5568]">
                          {claim}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* 4. CHECKPOT LOCAL BRIDGE */}
      <section className="py-14 lg:py-18 px-6 lg:px-8 2xl:px-12 bg-white text-center border-b border-[#EDEAE4]">
        <div className="mx-auto max-w-2xl">
          <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2">
            Bei Checkpot in Hietzing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] mb-3.5 leading-snug tracking-tight">
            {`${brand.name} bei Checkpot entdecken.`}
          </h2>
          <p className="text-[15.5px] sm:text-[17px] text-[#4A5568] leading-relaxed mb-7">
            Ausgewählte Stücke dieser Marke finden Sie direkt bei uns im Geschäft. Wir beraten Sie gerne persönlich zu Passform und Kombinationen.
          </p>
          <Link
            href={"/kontakt" as Route}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-8 py-3.5 text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
          >
            Besuch planen <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* 5. CHECKPOT × BRAND LOOKS */}
      <section className="py-18 lg:py-24 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 lg:mb-16">
            <div>
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2">
                Inspiration
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] tracking-tight">
                {`Checkpot × ${brand.name}`}
              </h2>
            </div>
            <p className="text-[15px] sm:text-[16px] text-[#5A6578] max-w-md">
              {`So kombinieren wir die Stücke von ${brand.name} bei Checkpot.`}
            </p>
          </div>

          {relatedOutfits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedOutfits.map((outfit) => {
                const focalPoint = outfit.media?.focalPoint || "50% 30%";

                return (
                  <div key={outfit.id} className="flex flex-col group">
                    <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
                      {outfit.media?.url ? (
                        <Image
                          src={outfit.media.url}
                          alt={outfit.media.alt || outfit.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          style={{ objectPosition: focalPoint }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-6 text-center text-[#5A6578]">
                          <span className="font-display text-lg">{outfit.title}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-display text-[17.5px] font-normal text-[#1A1A1A] mt-3 leading-snug">
                      {outfit.title}
                    </h3>

                    {outfit.note && (
                      <p className="text-[13px] text-[#5A6578] mt-1 leading-normal line-clamp-2">
                        {outfit.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 px-6 text-center max-w-lg mx-auto bg-[#FAF9F6] border border-[#EDEAE4] rounded-sm">
              <p className="text-[15.5px] text-[#4A5568] leading-relaxed mb-5">
                {`Diese Marke entdecken Sie direkt bei uns im Geschäft in Hietzing.`}
              </p>
              <Link
                href={"/kontakt" as Route}
                className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-6 py-3 text-[12.5px] font-medium uppercase tracking-[0.08em] text-white transition-colors"
              >
                Besuchen Sie uns <span className="ml-1.5" aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. FURTHER BRANDS (TYPOGRAPHY-LED DISCOVERY) */}
      {additionalBrands.length > 0 && (
        <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-16 lg:py-20 px-6 lg:px-8 2xl:px-12">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10 pb-4 border-b border-[#EDEAE4]">
              <h2 className="font-display text-2xl sm:text-3xl text-[#1A1A1A]">
                Weitere Marken entdecken
              </h2>
              <Link
                href={"/marken" as Route}
                className="group inline-flex items-center text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors"
              >
                Alle Marken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {additionalBrands.map((additionalBrand) => (
                <Link
                  key={additionalBrand.slug}
                  href={`/marken/${additionalBrand.slug}` as Route}
                  className="group flex flex-col p-6 rounded-sm bg-white border border-[#EDEAE4] hover:border-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718096] mb-2 block">
                    Boutique Hietzing
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl text-[#1A1A1A] group-hover:text-[#C01718] transition-colors mb-3">
                    {additionalBrand.name}
                  </h3>
                  {additionalBrand.summary && (
                    <p className="text-[14px] text-[#5A6578] leading-relaxed line-clamp-2 mb-4 flex-1">
                      {additionalBrand.summary}
                    </p>
                  )}
                  <span className="inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] group-hover:text-[#C01718] transition-colors pt-2 border-t border-[#F2EFEB]">
                    Marke ansehen <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
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
