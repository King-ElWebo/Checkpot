import Image from "next/image";
import Link from "next/link";
import type { Metadata, Route } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedOutfits } from "@/lib/repositories/outfits";
import { ModeStyleWorlds, type StyleWorldItem } from "@/components/public/mode-style-worlds";
import { FadeIn } from "@/components/public/motion/fade-in";

const seo = seoRoutes.find((r) => r.route === "/mode")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ModePage() {
  const outfits = await listPublishedOutfits();

  // Map real outfits to style taxonomy if available, otherwise use curated boutique visuals
  const findOutfitForStyle = (styleKeyword: string) => {
    return outfits.find(o =>
      o.categories.some(c => c.name.toLowerCase().includes(styleKeyword.toLowerCase())) &&
      o.media?.url
    );
  };

  const laessigOutfit = findOutfitForStyle("lässig") || findOutfitForStyle("casual");
  const klassischOutfit = findOutfitForStyle("klassisch") || findOutfitForStyle("classic");
  const femininOutfit = findOutfitForStyle("feminin");
  const retroOutfit = findOutfitForStyle("retro");

  const styleWorlds: StyleWorldItem[] = [
    {
      id: "laessig",
      name: "Lässig",
      subtitle: "Entspannt & Unkompliziert",
      description: "Bequeme Schnitte, weiche Stoffe und tragbare Silhouetten für jeden Tag – unaufgeregt und stilvoll kombiniert.",
      imageUrl: laessigOutfit?.media?.url || "/customer/outfit-autumn-layer.jpg",
      imageAlt: laessigOutfit?.title || "Lässiger Stil bei Checkpot",
      focalPoint: laessigOutfit?.media?.focalPoint || "50% 30%",
      outfitTitle: laessigOutfit ? laessigOutfit.title : "Herbstliche Lagen & Strick",
    },
    {
      id: "klassisch",
      name: "Klassisch",
      subtitle: "Zeitlos & Souverän",
      description: "Klare Linien, hochwertige Materialien und zeitlose Formen, die Saison für Saison Freude bereiten.",
      imageUrl: klassischOutfit?.media?.url || "/customer/outfit-blue-winter.jpg",
      imageAlt: klassischOutfit?.title || "Klassischer Stil bei Checkpot",
      focalPoint: klassischOutfit?.media?.focalPoint || "50% 25%",
      outfitTitle: klassischOutfit ? klassischOutfit.title : "Klassischer Wollmantel & Feinstrick",
    },
    {
      id: "feminin",
      name: "Feminin",
      subtitle: "Fließend & Elegant",
      description: "Besondere Kleider, fließende Stoffe und feine Silhouetten, die Ihre Ausstrahlung unterstreichen.",
      imageUrl: femininOutfit?.media?.url || "/customer/outfit-summer-pattern.jpg",
      imageAlt: femininOutfit?.title || "Femininer Stil bei Checkpot",
      focalPoint: femininOutfit?.media?.focalPoint || "50% 30%",
      outfitTitle: femininOutfit ? femininOutfit.title : "Musterkleid in leuchtenden Farben",
    },
    {
      id: "retro",
      name: "Retro",
      subtitle: "Charakter & Vintage-Inspiration",
      description: "Grafische und florale Muster mit besonderem Charme, nostalgische Farbwelten und charakterstarke Akzente.",
      imageUrl: retroOutfit?.media?.url || "/customer/textile-sorgenfri-detail.jpg",
      imageAlt: retroOutfit?.title || "Retro-inspirierte Mode bei Checkpot",
      focalPoint: retroOutfit?.media?.focalPoint || "50% 45%",
      outfitTitle: retroOutfit ? retroOutfit.title : "Detailreiche Muster & nordische Romantik",
    },
  ];

  // Active / Highlight items (max 3 items)
  const currentHighlights = outfits.slice(0, 3);

  return (
    <div className="flex flex-col bg-white">
      
      {/* 1. QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Mode", href: "/mode" },
          ]}
        />
      </div>

      {/* 2. EVERGREEN FASHION HERO */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-2 sm:pt-4 pb-8 sm:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-6 sm:gap-10 lg:gap-14 xl:gap-18 items-center">
          
          {/* Hero Text */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Ausgewählt für Checkpot
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] 2xl:text-[60px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-3 sm:mb-5">
              Mode mit Persönlichkeit.
            </h1>

            <p className="text-[15.5px] sm:text-[18px] 2xl:text-[19.5px] text-[#4A5568] leading-relaxed max-w-xl">
              Farben, Muster und Schnitte, die nicht beliebig wirken – sondern zu Ihnen und Ihrem persönlichen Stil passen.
            </p>
          </FadeIn>

          {/* Asymmetric Hero Imagery */}
          <FadeIn delay={120} duration={600} translateY={16} className="relative">
            {/* Main Visual */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[340px] sm:max-h-[440px] 2xl:max-h-[500px] w-full rounded-sm overflow-hidden bg-[#EFECE6] shadow-[0_12px_32px_rgba(0,0,0,0.04)] border border-[#E5E2DC]">
              <Image
                src="/customer/outfit-blue-summer.jpg"
                alt="Sommerliches Ensemble mit Musterakzent bei Checkpot"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_25%]"
                priority
              />
            </div>

            {/* Inset Cut-In Texture Accent */}
            <div className="hidden sm:block absolute -bottom-5 -left-5 lg:-left-8 w-40 lg:w-48 aspect-[4/3] rounded-sm overflow-hidden bg-white border border-[#E5E2DC] shadow-[0_12px_24px_rgba(0,0,0,0.08)] z-10">
              <Image
                src="/customer/textile-sorgenfri-detail.jpg"
                alt="Textile Musterdetails und Farbwelten"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 3. WAS SIE BEI UNS ENTDECKEN (4 THEMES: ALTERNATING PHOTO & TYPOGRAPHY ON MOBILE) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 sm:py-14 lg:py-18 2xl:py-22 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-4 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Unser Sortiment & Anspruch
              </span>
              <span className="w-4 h-[2px] bg-[#C01718]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] 2xl:text-[46px] font-normal leading-[1.12] tracking-tight text-[#1A1A1A]">
              Was Sie bei uns entdecken
            </h2>
          </div>

          <div className="space-y-8 sm:space-y-10 lg:space-y-14">
            
            {/* Theme 1: FARBEN & MUSTER (Mobile: Image-Led Anchor A | Desktop: Image Left, Text Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center">
              <FadeIn duration={600} translateY={16} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.3/1] max-h-[300px] sm:max-h-[380px] 2xl:max-h-[420px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
                <Image
                  src="/customer/outfit-summer-pattern.jpg"
                  alt="Farben und florale Muster bei Checkpot"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </FadeIn>
              <FadeIn delay={100} duration={600} translateY={16} className="flex flex-col">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-1">
                  01 · Ausdruck
                </span>
                <h3 className="font-display text-xl sm:text-3xl lg:text-[30px] font-normal text-[#1A1A1A] mb-2 sm:mb-3">
                  Farben & Muster
                </h3>
                <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Von kräftigen Farben bis zu floralen und grafischen Prints – Mode darf bei Checkpot sichtbar Persönlichkeit zeigen.
                </p>
              </FadeIn>
            </div>

            {/* Theme 2: SCHNITTE & KOMBINATIONEN (Mobile: Typography-Led | Desktop: Text Left, Image Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center border-b border-[#EDEAE4] lg:border-b-0 pb-6 lg:pb-0">
              <FadeIn duration={600} translateY={16} className="flex flex-col">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-1">
                  02 · Harmonie
                </span>
                <h3 className="font-display text-xl sm:text-3xl lg:text-[30px] font-normal text-[#1A1A1A] mb-2 sm:mb-3">
                  Schnitte & Kombinationen
                </h3>
                <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Kleider, Hosen, Jacken und Strick werden so kombiniert, dass daraus ein stimmiger und tragbarer Look entsteht.
                </p>
              </FadeIn>
              {/* Image visible on desktop only */}
              <FadeIn delay={100} duration={600} translateY={16} className="hidden lg:block relative aspect-[1.3/1] max-h-[380px] 2xl:max-h-[420px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
                <Image
                  src="/customer/outfit-autumn-layer.jpg"
                  alt="Kombinationen aus Strick und Jacke"
                  fill
                  sizes="(min-width: 1024px) 50vw, 0px"
                  className="object-cover"
                />
              </FadeIn>
            </div>

            {/* Theme 3: VON LÄSSIG BIS FEMININ (Mobile: Image-Led Anchor B | Desktop: Image Left, Text Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center">
              <FadeIn duration={600} translateY={16} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.3/1] max-h-[300px] sm:max-h-[380px] 2xl:max-h-[420px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
                {/* Mobile shows autumn layered look for visual silhouette contrast against pattern dress */}
                <Image
                  src="/customer/outfit-autumn-layer.jpg"
                  alt="Kombinationen und tragbare Silhouetten"
                  fill
                  sizes="(min-width: 1024px) 0px, 100vw"
                  className="block lg:hidden object-cover"
                />
                {/* Desktop maintains original approved visual */}
                <Image
                  src="/customer/outfit-blue-summer.jpg"
                  alt="Feminine und lässige Schnitte"
                  fill
                  sizes="(min-width: 1024px) 50vw, 0px"
                  className="hidden lg:block object-cover"
                />
              </FadeIn>
              <FadeIn delay={100} duration={600} translateY={16} className="flex flex-col">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-1">
                  03 · Vielfalt
                </span>
                <h3 className="font-display text-xl sm:text-3xl lg:text-[30px] font-normal text-[#1A1A1A] mb-2 sm:mb-3">
                  Von lässig bis feminin
                </h3>
                <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Nicht jede Frau sucht denselben Stil. Deshalb reicht die Auswahl von entspannt und unkompliziert bis klassisch, feminin und verspielt.
                </p>
              </FadeIn>
            </div>

            {/* Theme 4: MIT BLICK AUF PASSFORM (Mobile: Typography-Led | Desktop: Text Left, Image Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center">
              <FadeIn duration={600} translateY={16} className="flex flex-col">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-1">
                  04 · Wohlgefühl
                </span>
                <h3 className="font-display text-xl sm:text-3xl lg:text-[30px] font-normal text-[#1A1A1A] mb-2 sm:mb-3">
                  Mit Blick auf Passform
                </h3>
                <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Entscheidend ist nicht nur, was schön aussieht, sondern was gut sitzt, sich angenehm trägt und wirklich zu Ihnen passt.
                </p>
              </FadeIn>
              {/* Image visible on desktop only */}
              <FadeIn delay={100} duration={600} translateY={16} className="hidden lg:block relative aspect-[1.3/1] max-h-[380px] 2xl:max-h-[420px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
                <Image
                  src="/customer/outfit-blue-winter.jpg"
                  alt="Hochwertige Passform und Materialgefühl"
                  fill
                  sizes="(min-width: 1024px) 50vw, 0px"
                  className="object-cover"
                />
              </FadeIn>
            </div>

          </div>

        </div>
      </section>

      {/* 4. STILWELTEN (TYPOGRAPHY-LED EDITORIAL INTERACTION) */}
      <section className="py-10 sm:py-14 lg:py-18 2xl:py-22 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="max-w-2xl mb-6 sm:mb-10 lg:mb-14">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Vielfalt & Ausdruck
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal leading-[1.12] tracking-tight text-[#1A1A1A] mb-2">
              Stilwelten
            </h2>
            <p className="text-[14.5px] sm:text-[17px] text-[#4A5568] leading-relaxed">
              Vier Richtungen, die sich bei Checkpot immer wieder neu verbinden.
            </p>
          </div>

          <ModeStyleWorlds styles={styleWorlds} />
        </div>
      </section>

      {/* 5. AKTUELL BEI CHECKPOT (COMPACT LOOK TEASER) */}
      {currentHighlights.length > 0 && (
        <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 sm:py-14 lg:py-18 px-6 lg:px-8 2xl:px-12">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            {/* Header with single direct CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
              <div>
                <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1">
                  Einblicke in die Boutique
                </span>
                <h2 className="font-display text-2xl sm:text-4xl lg:text-[38px] font-normal text-[#1A1A1A] tracking-tight">
                  Aktuell bei Checkpot
                </h2>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <p className="text-[14px] sm:text-[15.5px] text-[#5A6578] max-w-md hidden md:block">
                  Ausgewählte Stücke und Impressionen aus unseren aktuellen Kollektionen in Hietzing.
                </p>
                <Link
                  href={"/outfits" as Route}
                  className="group inline-flex items-center text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 shrink-0"
                >
                  Outfits entdecken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Mobile Touch Rail (< 768px): Compact horizontal swipe with next-look edge visible */}
            <div className="flex md:hidden gap-3.5 overflow-x-auto snap-x scrollbar-none pb-2 -mx-6 px-6">
              {currentHighlights.map((highlight) => (
                <div key={highlight.id} className="w-[72vw] max-w-[280px] shrink-0 snap-start group flex flex-col">
                  <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                    {highlight.media?.url ? (
                      <Image
                        src={highlight.media.url}
                        alt={highlight.media.alt || highlight.title}
                        fill
                        sizes="72vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-[#4A5568]">
                        <span className="font-display text-base">{highlight.title}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-[15.5px] font-medium text-[#1A1A1A] line-clamp-1">
                    {highlight.title}
                  </h3>
                  {highlight.availabilityNote && (
                    <span className="text-[11px] text-[#8B1E1F]/85 mt-0.5">
                      {highlight.availabilityNote}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Grid (>= 768px) — STRICTLY FROZEN */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
              {currentHighlights.map((highlight) => (
                <div key={highlight.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
                    {highlight.media?.url ? (
                      <Image
                        src={highlight.media.url}
                        alt={highlight.media.alt || highlight.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-[#4A5568]">
                        <span className="font-display text-lg">{highlight.title}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-[16.5px] font-medium text-[#1A1A1A]">
                    {highlight.title}
                  </h3>
                  {highlight.availabilityNote && (
                    <span className="text-[11.5px] text-[#8B1E1F]/85 mt-0.5">
                      {highlight.availabilityNote}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TWO BRIDGES: OUTFITS & MARKEN (OPEN EDITORIAL TYPOGRAPHIC SPLIT) */}
      <section className="py-10 sm:py-14 lg:py-20 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-start divide-y lg:divide-y-0 lg:divide-x divide-[#EDEAE4]">
            
            {/* Bridge 1: Lookbook */}
            <div className="flex flex-col pb-6 sm:pb-8 lg:pb-0">
              <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
                Inspiration
              </span>
              <h3 className="font-display text-xl sm:text-3xl lg:text-[32px] font-normal text-[#1A1A1A] mb-2 sm:mb-3 leading-snug">
                So kann das aussehen.
              </h3>
              <p className="text-[14.5px] sm:text-[16px] leading-relaxed text-[#4A5568] mb-5 sm:mb-6 max-w-md">
                Entdecken Sie konkrete Styling-Kombinationen und kuratierte Looks in unserem Lookbook.
              </p>
              <Link
                href={"/outfits" as Route}
                className="group inline-flex items-center text-[12.5px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 self-start focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                Outfits entdecken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Bridge 2: Brands */}
            <div className="flex flex-col pt-6 sm:pt-8 lg:pt-0 lg:pl-12 xl:pl-16">
              <span className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-1.5 sm:mb-2">
                Herkunft & Qualität
              </span>
              <h3 className="font-display text-xl sm:text-3xl lg:text-[32px] font-normal text-[#1A1A1A] mb-2 sm:mb-3 leading-snug">
                Labels, die wir für Sie auswählen.
              </h3>
              <p className="text-[14.5px] sm:text-[16px] leading-relaxed text-[#4A5568] mb-5 sm:mb-6 max-w-md">
                Entdecken Sie die Marken, die wir mit Sorgfalt und Blick auf Qualität für Checkpot auswählen.
              </p>
              <Link
                href={"/marken" as Route}
                className="group inline-flex items-center text-[12.5px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 self-start focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                Unsere Marken entdecken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FINAL CONSULTATION CTA */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-10 sm:py-14 lg:py-16 px-6 lg:px-8 2xl:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#1A1A1A] mb-3 leading-snug">
            Sie müssen nicht schon wissen,<br />was zu Ihnen passt.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#4A5568] leading-relaxed mb-6">
            Gemeinsam finden wir Farben, Schnitte und Kombinationen, in denen Sie sich wirklich wohlfühlen.
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
