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

  // Active / Highlight items (2-3 items)
  const currentHighlights = outfits.slice(0, 3);

  return (
    <div className="flex flex-col bg-white">
      
      {/* 1. QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-6 pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Mode", href: "/mode" },
          ]}
        />
      </div>

      {/* 2. EVERGREEN FASHION HERO */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-6 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.25fr] gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* Hero Text */}
          <FadeIn duration={600} translateY={16} className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Ausgewählt für Checkpot
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] 2xl:text-[64px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-6">
              Mode mit Persönlichkeit.
            </h1>

            <p className="text-[16.5px] sm:text-[18.5px] 2xl:text-[20px] text-[#4A5568] leading-relaxed max-w-xl">
              Farben, Muster und Schnitte, die nicht beliebig wirken – sondern zu Ihnen und Ihrem persönlichen Stil passen.
            </p>
          </FadeIn>

          {/* Asymmetric Hero Imagery */}
          <FadeIn delay={120} duration={600} translateY={16} className="relative">
            {/* Main Visual */}
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[520px] 2xl:max-h-[580px] w-full rounded-sm overflow-hidden bg-[#EFECE6] shadow-[0_16px_40px_rgba(0,0,0,0.05)] border border-[#E5E2DC]">
              <Image
                src="/customer/outfit-blue-summer.jpg"
                alt="Sommerliches Ensemble mit Musterakzent bei Checkpot"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[50%_25%]"
                priority
              />
            </div>

            {/* Inset Cut-In Texture Accent */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 lg:-left-10 w-44 lg:w-52 aspect-[4/3] rounded-sm overflow-hidden bg-white border border-[#E5E2DC] shadow-[0_12px_28px_rgba(0,0,0,0.08)] z-10">
              <Image
                src="/customer/textile-sorgenfri-detail.jpg"
                alt="Textile Musterdetails und Farbwelten"
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 3. WAS SIE BEI UNS ENTDECKEN (4 THEMES IN ALTERNATING EDITORIAL RHYTHM) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-20 lg:py-28 2xl:py-32 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-4 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Unser Sortiment & Anspruch
              </span>
              <span className="w-4 h-[2px] bg-[#C01718]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] 2xl:text-[50px] font-normal leading-[1.12] tracking-tight text-[#1A1A1A]">
              Was Sie bei uns entdecken
            </h2>
          </div>

          <div className="space-y-16 lg:space-y-24">
            
            {/* Theme 1: FARBEN & MUSTER (Image Left | Text Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 xl:gap-20 items-center">
              <FadeIn duration={600} translateY={16} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.25/1] max-h-[440px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
                <Image
                  src="/customer/textile-sorgenfri-detail.jpg"
                  alt="Farben und florale Muster bei Checkpot"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </FadeIn>
              <FadeIn delay={100} duration={600} translateY={16} className="flex flex-col">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                  01 · Ausdruck
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] mb-4">
                  Farben & Muster
                </h3>
                <p className="text-[16px] sm:text-[17.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Von kräftigen Farben bis zu floralen und grafischen Prints – Mode darf bei Checkpot sichtbar Persönlichkeit zeigen.
                </p>
              </FadeIn>
            </div>

            {/* Theme 2: SCHNITTE & KOMBINATIONEN (Text Left | Image Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 xl:gap-20 items-center">
              <FadeIn duration={600} translateY={16} className="flex flex-col order-2 lg:order-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                  02 · Harmonie
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] mb-4">
                  Schnitte & Kombinationen
                </h3>
                <p className="text-[16px] sm:text-[17.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Kleider, Hosen, Jacken und Strick werden so kombiniert, dass daraus ein stimmiger und tragbarer Look entsteht.
                </p>
              </FadeIn>
              <FadeIn delay={100} duration={600} translateY={16} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.25/1] max-h-[440px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.04)] order-1 lg:order-2">
                <Image
                  src="/customer/outfit-autumn-layer.jpg"
                  alt="Kombinationen aus Strick und Jacke"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </FadeIn>
            </div>

            {/* Theme 3: VON LÄSSIG BIS FEMININ (Image Left | Text Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 xl:gap-20 items-center">
              <FadeIn duration={600} translateY={16} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.25/1] max-h-[440px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
                <Image
                  src="/customer/outfit-summer-pattern.jpg"
                  alt="Feminine und lässige Schnitte"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </FadeIn>
              <FadeIn delay={100} duration={600} translateY={16} className="flex flex-col">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                  03 · Vielfalt
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] mb-4">
                  Von lässig bis feminin
                </h3>
                <p className="text-[16px] sm:text-[17.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Nicht jede Frau sucht denselben Stil. Deshalb reicht die Auswahl von entspannt und unkompliziert bis klassisch, feminin und verspielt.
                </p>
              </FadeIn>
            </div>

            {/* Theme 4: MIT BLICK AUF PASSFORM (Text Left | Image Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 xl:gap-20 items-center">
              <FadeIn duration={600} translateY={16} className="flex flex-col order-2 lg:order-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                  04 · Wohlgefühl
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] mb-4">
                  Mit Blick auf Passform
                </h3>
                <p className="text-[16px] sm:text-[17.5px] leading-relaxed text-[#4A5568] max-w-lg">
                  Entscheidend ist nicht nur, was schön aussieht, sondern was gut sitzt, sich angenehm trägt und wirklich zu Ihnen passt.
                </p>
              </FadeIn>
              <FadeIn delay={100} duration={600} translateY={16} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.25/1] max-h-[440px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_12px_32px_rgba(0,0,0,0.04)] order-1 lg:order-2">
                <Image
                  src="/customer/outfit-blue-winter.jpg"
                  alt="Hochwertige Passform und Materialgefühl"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </FadeIn>
            </div>

          </div>

        </div>
      </section>

      {/* 4. STILWELTEN (INTERACTIVE TYPOGRAPHY-LED SELECTION) */}
      <section className="py-20 lg:py-28 2xl:py-32 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="max-w-2xl mb-12 lg:mb-16">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Vielfalt & Ausdruck
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.12] tracking-tight text-[#1A1A1A] mb-3">
              Stilwelten
            </h2>
            <p className="text-[16px] sm:text-[17.5px] text-[#4A5568] leading-relaxed">
              Vier Richtungen, die sich bei Checkpot immer wieder neu verbinden.
            </p>
          </div>

          <ModeStyleWorlds styles={styleWorlds} />
        </div>
      </section>

      {/* 5. AKTUELL BEI CHECKPOT (2-3 VISUAL HIGHLIGHTS) */}
      {currentHighlights.length > 0 && (
        <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-18 lg:py-24 px-6 lg:px-8 2xl:px-12">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-14">
              <div>
                <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2">
                  Einblicke in die Boutique
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] tracking-tight">
                  Aktuell bei Checkpot
                </h2>
              </div>
              <p className="text-[15.5px] text-[#5A6578] max-w-md">
                Ausgewählte Stücke und Impressionen aus unseren aktuellen Kollektionen in Hietzing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
                  <h3 className="mt-3.5 font-display text-[17px] font-medium text-[#1A1A1A]">
                    {highlight.title}
                  </h3>
                  {highlight.availabilityNote && (
                    <span className="text-[12px] text-[#8B1E1F]/85 mt-0.5">
                      {highlight.availabilityNote}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. TWO BRIDGES: OUTFITS & MARKEN DISCOVERY */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-18">
            
            {/* Bridge 1: Lookbook */}
            <div className="bg-[#FAF9F6] border border-[#EDEAE4] rounded-sm p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2.5">
                  Inspiration
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] mb-4 leading-snug">
                  So kann das aussehen.
                </h3>
                <p className="text-[15.5px] sm:text-[16.5px] leading-relaxed text-[#4A5568] mb-8">
                  Entdecken Sie konkrete Styling-Kombinationen und kuratierte Looks in unserem Lookbook.
                </p>
              </div>
              <div>
                <Link
                  href={"/outfits" as Route}
                  className="group inline-flex items-center text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Outfits entdecken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Bridge 2: Brands */}
            <div className="bg-[#FAF9F6] border border-[#EDEAE4] rounded-sm p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2.5">
                  Herkunft & Qualität
                </span>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] mb-4 leading-snug">
                  Labels, die wir für Sie auswählen.
                </h3>
                <p className="text-[15.5px] sm:text-[16.5px] leading-relaxed text-[#4A5568] mb-8">
                  Von skandinavischem Minimalismus bis zu italienischer Leichtigkeit – mit Liebe kuratierte Marken.
                </p>
              </div>
              <div>
                <Link
                  href={"/marken" as Route}
                  className="group inline-flex items-center text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Unsere Marken entdecken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FINAL CONSULTATION CTA */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-16 lg:py-20 px-6 lg:px-8 2xl:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1A1A1A] mb-4 leading-snug">
            Sie müssen nicht schon wissen,<br />was zu Ihnen passt.
          </h2>
          <p className="text-[16px] sm:text-[17.5px] text-[#4A5568] leading-relaxed mb-8">
            Gemeinsam finden wir Farben, Schnitte und Kombinationen, in denen Sie sich wirklich wohlfühlen.
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
