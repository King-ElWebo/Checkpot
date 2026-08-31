import Image from "next/image";
import Link from "next/link";
import type { Metadata, Route } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { FadeIn } from "@/components/public/motion/fade-in";

const seo = seoRoutes.find((r) => r.route === "/marken")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MarkenPage() {
  const activeBrands = await listPublishedBrands();
  const brandCount = activeBrands.length;

  // Select 6-7 active brand names for the typographic texture wall in the hero
  const textureBrands = activeBrands.slice(0, 7);

  return (
    <div className="flex flex-col bg-white">
      {/* 1. QUIET BREADCRUMB */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-6 pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
          ]}
        />
      </div>

      {/* 2. COMPACT EDITORIAL HERO */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-4 pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-14 xl:gap-20 items-center pb-8 border-b border-[#EDEAE4]">
          
          {/* Left: Heading & Intro Copy */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                {`${brandCount} Labels · Ausgewählt für Checkpot`}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[50px] 2xl:text-[58px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-4">
              Unsere Marken.
            </h1>

            <p className="text-[16px] sm:text-[17.5px] 2xl:text-[19px] text-[#4A5568] leading-relaxed max-w-xl">
              Unterschiedliche Handschriften, Farben und Stilrichtungen – sorgfältig für unsere Boutique in Hietzing ausgewählt.
            </p>
          </FadeIn>

          {/* Right: Typographic Brand Texture Wall */}
          {textureBrands.length > 0 && (
            <FadeIn delay={120} duration={600} translateY={16} className="hidden sm:flex flex-col justify-center py-4 lg:py-6 px-6 sm:px-8 bg-[#FAF9F6] border border-[#EDEAE4] rounded-sm">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[#718096] font-semibold mb-3.5 block">
                Auswahl in Hietzing
              </span>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 font-display text-lg lg:text-xl text-[#5A6578]">
                {textureBrands.map((b, idx) => {
                  const isRedAccent = idx === 1;
                  const isStrong = idx % 2 === 0;

                  return (
                    <span
                      key={b.id}
                      className={`transition-colors ${
                        isRedAccent
                          ? 'text-[#C01718] font-medium'
                          : isStrong
                          ? 'text-[#1A1A1A] font-normal'
                          : 'text-[#718096] font-light'
                      }`}
                    >
                      {b.name}
                      {idx < textureBrands.length - 1 && (
                        <span className="ml-4 text-[#D5D2CA]" aria-hidden="true">·</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </FadeIn>
          )}

        </div>
      </section>

      {/* 3. 3-COLUMN BRAND LIBRARY GRID */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-2 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 xl:gap-x-14 gap-y-12 sm:gap-y-16 lg:gap-y-20">
          {activeBrands.map((brand, idx) => {
            const indexNumber = String(idx + 1).padStart(2, '0');

            return (
              <Link
                key={brand.slug}
                href={`/marken/${brand.slug}` as Route}
                className="group flex flex-col focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4 rounded-sm"
              >
                {/* Visual Area */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] xl:aspect-[4/3] rounded-sm overflow-hidden bg-[#FAF9F6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                  {brand.image?.url ? (
                    <Image
                      src={brand.image.url}
                      alt={brand.image.alt || brand.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      style={{ objectPosition: brand.image.focalPoint || "center" }}
                    />
                  ) : (
                    /* Intentional Typographic Fallback Panel */
                    <div className="flex h-full w-full flex-col justify-between p-6 sm:p-7 bg-[#F6F4EE] select-none transition-colors duration-300 group-hover:bg-[#F0EDE5]">
                      {/* Top Index */}
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C01718]" aria-hidden="true" />
                        <span className="text-[11.5px] font-mono font-medium tracking-wider text-[#718096]">
                          {indexNumber}
                        </span>
                      </div>

                      {/* Center Brand Name Display */}
                      <div className="text-center px-2 py-4">
                        <span className="font-display text-2xl sm:text-3xl xl:text-[32px] font-normal leading-tight tracking-tight text-[#1A1A1A] group-hover:text-[#C01718] transition-colors block">
                          {brand.name}
                        </span>
                      </div>

                      {/* Bottom Detail */}
                      <div className="text-center border-t border-[#E5E2DC] pt-2.5">
                        <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#718096] font-medium block">
                          Bei Checkpot · Hietzing
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Identity & Content */}
                <div className="mt-5 flex flex-1 flex-col items-start">
                  <h2 className="font-display text-2xl lg:text-[26px] 2xl:text-[28px] font-normal tracking-tight text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C01718]">
                    {brand.name}
                  </h2>

                  {brand.summary && (
                    <p className="mt-2 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#4A5568] max-w-md line-clamp-3">
                      {brand.summary}
                    </p>
                  )}

                  <div className="mt-4 pt-1">
                    <span className="inline-flex items-center text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] border-b border-[#1A1A1A]/30 group-hover:border-[#C01718] pb-0.5 transition-colors duration-200 group-hover:text-[#C01718]">
                      Marke entdecken{" "}
                      <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. BOTTOM STORE CTA */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-16 lg:py-20 px-6 lg:px-8 2xl:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2.5">
            Persönlich entdecken
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] mb-3.5 leading-snug">
            Lieber anprobieren als nur anschauen?
          </h2>
          <p className="text-[15.5px] sm:text-[17px] text-[#4A5568] leading-relaxed mb-7 max-w-xl mx-auto">
            Viele unserer Marken entdecken Sie direkt bei uns in Hietzing – mit persönlicher Beratung.
          </p>
          <Link
            href={"/kontakt" as Route}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-8 py-3.5 text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
          >
            Besuchen Sie uns <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
