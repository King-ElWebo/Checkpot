import Image from "next/image";
import Link from "next/link";
import type { Metadata, Route } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { imagery, seoRoutes } from "@/content/fixtures/checkpot";
import { getStoreDetails } from "@/lib/repositories/store-settings";

const seo = seoRoutes.find((r) => r.route === "/ueber-uns")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UeberUnsPage() {
  const storeDetails = await getStoreDetails();

  return (
    <div className="flex flex-col bg-white">
      {/* 1. QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Über uns", href: "/ueber-uns" },
          ]}
        />
      </div>

      {/* 2. EDITORIAL HERO (PERSONAL CONSULTATION / EXPERIENCE) */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-2 sm:pt-3 pb-8 sm:pb-10 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-6 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left: Heading & Intro */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3.5">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Persönliche Beratung in Wien-Hietzing
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] 2xl:text-[60px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-3 sm:mb-4">
              Zeit für Ihren Stil.
            </h1>

            <p className="text-[15.5px] sm:text-[19px] 2xl:text-[21px] text-[#1A1A1A] font-normal sm:font-medium leading-relaxed mb-2 sm:mb-3 max-w-xl">
              Bei Checkpot geht es nicht darum, Ihnen einfach etwas zu verkaufen. Gemeinsam finden wir Farben, Schnitte und Kombinationen, in denen Sie sich wirklich wohlfühlen.
            </p>

            <p className="text-[14px] sm:text-[17px] text-[#5A6578] leading-relaxed max-w-lg">
              Persönlich, ehrlich und mit viel Gespür für das, was zu Ihnen passt.
            </p>
          </FadeIn>

          {/* Right: Christa Consultation Image */}
          <FadeIn delay={120} duration={600} translateY={16} className="relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[300px] sm:max-h-[400px] lg:max-h-[460px] 2xl:max-h-[520px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.03)] sm:shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <Image
                src={imagery.hero.src}
                alt="Christa Hausmair bei der persönlichen Modeberatung im Checkpot Hietzing."
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.hero.objectPosition }}
              />
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 3. DIE BOUTIQUE (CONCENTRATED STORE CHAPTER: 1 LARGE + 2 SMALL ON MOBILE | ASYMMETRIC GRID ON DESKTOP) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 sm:py-14 lg:py-20 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          
          <div className="mb-6 sm:mb-10 lg:mb-12">
            <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
              Die Boutique
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] tracking-tight mb-2 sm:mb-3">
              Ein Geschäft zum Entdecken.
            </h2>
            <p className="text-[14.5px] sm:text-[17px] text-[#4A5568] leading-relaxed max-w-2xl">
              Farben, Muster, besondere Stücke – und genug Zeit, alles in Ruhe anzusehen und anzuprobieren. Checkpot ist ein Ort zum Stöbern, Kombinieren und Entdecken.
            </p>
          </div>

          {/* MOBILE PRESENTATION (< 1024px): 1 Large + 2 Small Images */}
          <div className="block lg:hidden space-y-2.5 sm:space-y-4">
            {/* Primary Wide Interior Image */}
            <div className="relative aspect-[16/10] sm:aspect-[3/2] max-h-[260px] sm:max-h-[340px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC]">
              <Image
                src="/customer/store/20260820_110653.jpg"
                alt="Innenraum der Checkpot Boutique in Wien-Hietzing mit Kleiderständern und Holzregalen."
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>

            {/* Supporting 2-Column Images */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC]">
                <Image
                  src="/customer/store/20260819_132541.jpg"
                  alt="Sorgfältig arrangierte Kleider und Farben auf Bügeln im Geschäft von Checkpot."
                  fill
                  sizes="50vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 40%" }}
                />
              </div>

              <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC]">
                <Image
                  src="/customer/store/20260820_110543.jpg"
                  alt="Textilauslage und stilvolle Accessoires in der Checkpot Boutique."
                  fill
                  sizes="50vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 50%" }}
                />
              </div>
            </div>
          </div>

          {/* DESKTOP PRESENTATION (>= 1024px) — STRICTLY FROZEN ASYMMETRIC GRID */}
          <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Large Store Interior Image */}
            <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[3/2] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.03)]">
              <Image
                src="/customer/store/20260820_110653.jpg"
                alt="Innenraum der Checkpot Boutique in Wien-Hietzing mit Kleiderständern und Holzregalen."
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>

            {/* Supporting Detail Images Column */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-8">
              <div className="relative aspect-[4/3] lg:aspect-[4/3] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                <Image
                  src="/customer/store/20260819_132541.jpg"
                  alt="Sorgfältig arrangierte Kleider und Farben auf Bügeln im Geschäft von Checkpot."
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 40%" }}
                />
              </div>

              <div className="relative aspect-[4/3] lg:aspect-[4/3] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                <Image
                  src="/customer/store/20260820_110543.jpg"
                  alt="Textilauslage und stilvolle Accessoires in der Checkpot Boutique."
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 50%" }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. UNSERE PHILOSOPHIE (3 CONCISE PRINCIPLES) */}
      <section className="bg-white py-10 sm:py-14 lg:py-18 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
              Unsere Philosophie
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] tracking-tight">
              Was bei der Beratung zählt.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Principle 01 */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4 sm:pt-5">
              <span className="text-[12px] font-mono font-bold text-[#C01718] mb-1.5 sm:mb-2.5 select-none">
                01
              </span>
              <h3 className="font-display text-lg sm:text-2xl text-[#1A1A1A] mb-1.5 sm:mb-2.5 leading-snug">
                Persönlich beraten
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                Wir hören zu und schauen gemeinsam, welche Farben, Schnitte und Kombinationen wirklich zu Ihnen passen.
              </p>
            </div>

            {/* Principle 02 */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4 sm:pt-5">
              <span className="text-[12px] font-mono font-bold text-[#C01718] mb-1.5 sm:mb-2.5 select-none">
                02
              </span>
              <h3 className="font-display text-lg sm:text-2xl text-[#1A1A1A] mb-1.5 sm:mb-2.5 leading-snug">
                Nicht jedem Trend folgen
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                Entscheidend ist nicht, was gerade alle tragen – sondern was Ihre Persönlichkeit unterstreicht.
              </p>
            </div>

            {/* Principle 03 */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4 sm:pt-5">
              <span className="text-[12px] font-mono font-bold text-[#C01718] mb-1.5 sm:mb-2.5 select-none">
                03
              </span>
              <h3 className="font-display text-lg sm:text-2xl text-[#1A1A1A] mb-1.5 sm:mb-2.5 leading-snug">
                Wohlfühlen statt verkleiden
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                Mode soll sich gut anfühlen und selbstverständlich zu Ihnen gehören.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CHRISTA (THE PERSON BEHIND CHECKPOT) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 sm:py-14 lg:py-20 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
            
            {/* Left: Christa Storefront Photo (Controlled Mobile Crop with Focal on Face & Store Context) */}
            <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[3/4] max-h-[320px] sm:max-h-[400px] lg:max-h-[440px] 2xl:max-h-[500px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.03)] sm:shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <Image
                src={imagery.founder.src}
                alt="Christa Hausmair vor der Boutique Checkpot in Wien Hietzing."
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 18%" }}
              />
            </div>

            {/* Right: Christa Story */}
            <div className="flex flex-col">
              <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
                Das Gesicht hinter Checkpot
              </span>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] mb-3 sm:mb-4 tracking-tight leading-snug">
                Christa Hausmair.
              </h2>
              <div className="space-y-3 sm:space-y-4 text-[14.5px] sm:text-[17px] text-[#4A5568] leading-relaxed max-w-xl">
                <p>
                  Checkpot Hietzing gibt es seit 2009. Christa Hausmair führt die Boutique mit einem klaren Anspruch: Mode soll nicht beliebig sein, sondern zur Frau passen, die sie trägt.
                </p>
                <p>
                  Für Christa steht deshalb nicht der schnelle Verkauf im Mittelpunkt, sondern die Frage, womit sich eine Kundin wirklich wohlfühlt und was zu ihrer Garderobe passt.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BOUTIQUE IMPRESSIONS (DESKTOP ONLY — HIDDEN ON MOBILE TO PREVENT REPETITION) */}
      <section className="hidden lg:block bg-white py-14 lg:py-20 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          
          <div className="mb-8 lg:mb-10">
            <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5">
              Einblicke in die Boutique
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] tracking-tight">
              Ein bisschen Checkpot zum Durchscrollen.
            </h2>
          </div>

          {/* 3 Real Boutique Highlights from images/store */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
              <Image
                src="/customer/store/20260819_132459.jpg"
                alt="Geschäftseinblicke bei Checkpot mit Holzregalen und Kollektionen."
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>

            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
              <Image
                src="/customer/store/20260813_125844.jpg"
                alt="Farbige Kleider und ausgewählte Stücke auf Bügeln in der Boutique."
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>

            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)] sm:col-span-2 lg:col-span-1">
              <Image
                src="/customer/store/20260820_110328.jpg"
                alt="Heller Boutique-Raum mit Kleiderstangen und Modeauswahl im Checkpot Hietzing."
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 40%" }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 7. VISIT CTA (VORBEIKOMMEN & ENTDECKEN) */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-10 sm:py-14 lg:py-18 px-6 lg:px-8 2xl:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
            Vorbeikommen & Entdecken
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] mb-2.5 sm:mb-3.5 leading-snug tracking-tight">
            Am besten lernen Sie Checkpot persönlich kennen.
          </h2>
          <p className="text-[14.5px] sm:text-[17px] text-[#4A5568] leading-relaxed mb-5 sm:mb-6 max-w-xl mx-auto">
            Besuchen Sie uns in Wien-Hietzing, stöbern Sie in Ruhe durch unsere Auswahl und lassen Sie sich persönlich beraten.
          </p>

          <div className="mb-6 sm:mb-8 text-[13.5px] sm:text-[14.5px] text-[#5A6578] leading-relaxed">
            <p className="font-medium text-[#1A1A1A]">
              {storeDetails.name} · {storeDetails.address.street}, {storeDetails.address.postalCode} {storeDetails.address.city}
            </p>
            {storeDetails.hours && storeDetails.hours.length > 0 && (
              <p className="mt-1 text-[12.5px] sm:text-[13.5px]">
                {storeDetails.hours.map((h) => `${h.label}: ${h.value}`).join(" · ")}
              </p>
            )}
          </div>

          <div>
            <Link
              href={"/kontakt" as Route}
              className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-7 py-3 text-[12.5px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 min-h-[44px]"
            >
              Besuch in Hietzing planen <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
