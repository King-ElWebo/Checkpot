import Link from "next/link";
import type { Metadata, Route } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { FadeIn } from "@/components/public/motion/fade-in";
import { MarkenDirectory } from "./marken-client";

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
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
          ]}
        />
      </div>

      {/* 2. COMPACT EDITORIAL HERO */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-2 sm:pt-4 pb-8 sm:pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 sm:gap-10 lg:gap-14 xl:gap-20 items-center pb-6 sm:pb-8 border-b border-[#EDEAE4]">
          
          {/* Left: Heading & Intro Copy */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                {`${brandCount} Labels · Ausgewählt für Checkpot`}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] 2xl:text-[58px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-3 sm:mb-4">
              Unsere Marken.
            </h1>

            <p className="text-[15px] sm:text-[17.5px] 2xl:text-[19px] text-[#4A5568] leading-relaxed max-w-xl">
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

      {/* 3. BRAND DIRECTORY (Mobile: 15-Brand Accordion | Desktop: 3-Column Grid) */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 pt-2 pb-12 sm:pb-16 lg:pb-24">
        <MarkenDirectory brands={activeBrands} />
      </section>

      {/* 4. BOTTOM STORE CTA */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-12 sm:py-16 lg:py-20 px-6 lg:px-8 2xl:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2 sm:mb-2.5">
            Persönlich entdecken
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] mb-3 leading-snug">
            Lieber anprobieren als nur anschauen?
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#4A5568] leading-relaxed mb-6 max-w-xl mx-auto">
            Viele unserer Marken entdecken Sie direkt bei uns in Hietzing – mit persönlicher Beratung.
          </p>
          <Link
            href={"/kontakt" as Route}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-7 py-3 text-[12.5px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 min-h-[44px]"
          >
            Besuchen Sie uns <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
