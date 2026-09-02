import Image from "next/image";
import Link from "next/link";
import type { Metadata, Route } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { seoRoutes, imagery } from "@/content/fixtures/checkpot";
import { StandardsAccordion } from "./standards-accordion";

const seo = seoRoutes.find((r) => r.route === "/fair-trade")!;

export const metadata: Metadata = {
  title: "Qualität, Herkunft & Transparenz | Checkpot Wien",
  description: "Transparenz statt pauschaler Versprechen. Erfahren Sie, worauf wir bei Materialien, Qualität und geprüften Markenstandards achten.",
  alternates: {
    canonical: seo.canonical,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FairTradePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Qualität & Herkunft", href: "/fair-trade" },
          ]}
        />
      </div>

      {/* 2. EDITORIAL HERO */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-2 sm:pt-3 pb-8 sm:pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left: Heading & Intro */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3.5">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Bewusster auswählen
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] 2xl:text-[58px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-3 sm:mb-4">
              Mode mit Blick auf Qualität und Herkunft.
            </h1>

            <p className="text-[15px] sm:text-[18px] 2xl:text-[19.5px] text-[#4A5568] leading-relaxed max-w-xl">
              Bei Checkpot zählt nicht nur, wie ein Kleidungsstück aussieht. Wir achten auf Qualität, Materialien und nachvollziehbare Angaben unserer Marken – und kommunizieren nur, was sich auch belegen lässt.
            </p>
          </FadeIn>

          {/* Right: Authentic Checkpot Textile / Clothing Visual */}
          <FadeIn delay={120} duration={600} translateY={16} className="relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[300px] sm:max-h-[380px] 2xl:max-h-[460px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <Image
                src={imagery.sustainabilityShelf.src}
                alt={imagery.sustainabilityShelf.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.sustainabilityShelf.objectPosition }}
              />
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 3. WORAUF WIR ACHTEN (3 CONCISE PRINCIPLES) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 sm:py-12 lg:py-16 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
              Worauf wir achten
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] tracking-tight">
              Drei Grundsätze für unsere Auswahl.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Principle 01 */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4 sm:pt-5">
              <span className="text-[12px] font-mono font-bold text-[#C01718] mb-1.5 sm:mb-2 select-none">
                01
              </span>
              <h3 className="font-display text-lg sm:text-2xl text-[#1A1A1A] mb-1.5 sm:mb-2 leading-snug">
                Qualität, die bleiben darf
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                Gute Verarbeitung, angenehme Materialien und tragbare Schnitte stehen für uns vor kurzlebigen Effekten.
              </p>
            </div>

            {/* Principle 02 */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4 sm:pt-5">
              <span className="text-[12px] font-mono font-bold text-[#C01718] mb-1.5 sm:mb-2 select-none">
                02
              </span>
              <h3 className="font-display text-lg sm:text-2xl text-[#1A1A1A] mb-1.5 sm:mb-2 leading-snug">
                Bewusst auswählen
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                Wir wählen Stücke aus, die sich gut kombinieren lassen und wirklich zur Kundin passen.
              </p>
            </div>

            {/* Principle 03 */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4 sm:pt-5">
              <span className="text-[12px] font-mono font-bold text-[#C01718] mb-1.5 sm:mb-2 select-none">
                03
              </span>
              <h3 className="font-display text-lg sm:text-2xl text-[#1A1A1A] mb-1.5 sm:mb-2 leading-snug">
                Transparenz statt großer Versprechen
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                Konkrete Angaben zeigen wir dort, wo sie nachvollziehbar belegt sind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NACHVOLLZIEHBAR STATT PAUSCHAL — STANDARDS & INITIATIVEN */}
      <section className="py-10 sm:py-12 lg:py-16 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          
          {/* Single Clear Introduction */}
          <div className="mb-6 sm:mb-10 lg:mb-12">
            <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
              Nachvollziehbar statt pauschal
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] tracking-tight mb-2">
              Standards & Initiativen.
            </h2>
            <p className="text-[14.5px] sm:text-[17px] text-[#4A5568] leading-relaxed max-w-2xl">
              Bei einzelnen Marken können konkrete Standards oder Mitgliedschaften nachvollziehbar belegt werden.
            </p>
          </div>

          {/* Standards Accordion (Mobile: Accordion with 1 open | Desktop: 2-Column Comparison) */}
          <StandardsAccordion />

          {/* Compact Brand Bridge */}
          <div className="mt-8 pt-5 border-t border-[#EDEAE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <p className="text-[13.5px] sm:text-[14.5px] text-[#5A6578]">
              Weitere geprüfte Angaben finden Sie direkt bei den jeweiligen Marken.
            </p>
            <Link
              href={"/marken" as Route}
              className="group inline-flex items-center text-[12px] sm:text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors"
            >
              Zu unseren Marken{" "}
              <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. PERSÖNLICH AUSWÄHLEN (CHRISTA / BERATUNG) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 sm:py-12 lg:py-16 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
            
            {/* Left: Christa / Consultation Visual */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[280px] sm:max-h-[380px] 2xl:max-h-[420px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <Image
                src={imagery.hero.src}
                alt="Persönliche Modeberatung im Checkpot Geschäft in Wien Hietzing."
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.hero.objectPosition }}
              />
            </div>

            {/* Right: Consultation Copy */}
            <div className="flex flex-col">
              <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
                Persönlich auswählen
              </span>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] mb-2.5 sm:mb-3.5 tracking-tight leading-snug">
                Gut beraten statt beliebig gekauft.
              </h2>
              <p className="text-[14.5px] sm:text-[16.5px] text-[#4A5568] leading-relaxed mb-5 sm:mb-6 max-w-xl">
                Ein Kleidungsstück soll nicht nur auf dem Bügel gefallen. Gemeinsam schauen wir auf Passform, Kombinationen und darauf, ob ein Stück wirklich zu Ihnen und Ihrer Garderobe passt.
              </p>
              <div>
                <Link
                  href={"/kontakt" as Route}
                  className="group inline-flex items-center text-[12px] sm:text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors duration-200 hover:text-[#C01718]"
                >
                  Besuch in Hietzing planen{" "}
                  <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. UNSER ANSPRUCH (CONCISE FINAL TRANSPARENCY SECTION) */}
      <section className="py-10 sm:py-12 lg:py-16 px-6 lg:px-8 2xl:px-12 bg-white text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
            Unser Anspruch
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] mb-2.5 sm:mb-3 leading-snug tracking-tight">
            Keine pauschalen Versprechen.
          </h2>
          <p className="text-[14.5px] sm:text-[16.5px] text-[#4A5568] leading-relaxed max-w-xl mx-auto mb-5 sm:mb-6">
            Wir nennen Standards und Merkmale dort, wo sie für eine Marke oder entsprechende Produkte nachvollziehbar belegt sind.
          </p>
          <div>
            <Link
              href={"/marken" as Route}
              className="group inline-flex items-center text-[12px] sm:text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors duration-200 hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
            >
              Unsere Marken entdecken{" "}
              <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
