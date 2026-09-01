import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/public/motion/fade-in";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { getSiteUrl } from "@/lib/site-config";
import { listHomepageOutfits } from "@/lib/repositories/outfits";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { BrandBookshelf } from "@/components/public/brand-bookshelf";
import { OutfitsHorizontalGallery } from "@/components/public/outfits-horizontal-gallery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [storeDetails, homepageOutfits, dbBrands] = await Promise.all([
    getStoreDetails(),
    listHomepageOutfits(10),
    listPublishedBrands(),
  ]);

  const siteUrl = getSiteUrl();
  const featuredBrands = dbBrands; // Use all published brands for robustness

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeDetails.name,
    image: new URL("/customer/store-christa-counter.jpg", siteUrl).toString(),
    telephone: storeDetails.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeDetails.address.street,
      postalCode: storeDetails.address.postalCode,
      addressLocality: storeDetails.address.city,
      addressCountry: storeDetails.address.country,
    },
    openingHoursSpecification: storeDetails.hours
      .filter((h) => h.schemaDays)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.schemaDays,
        opens: h.opens,
        closes: h.closes,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col bg-[#F9F9F8]">
        
        {/* 1. HERO — BOLD ASYMMETRIC EDITORIAL BOUTIQUE */}
        <section className="relative w-full overflow-hidden bg-[#F9F9F8] pt-6 sm:pt-10 lg:pt-14 xl:pt-16 2xl:pt-20 pb-8 sm:pb-12 lg:pb-16 xl:pb-20 2xl:pb-24 min-h-0 lg:min-h-[calc(84vh-80px)] 2xl:min-h-[calc(86vh-80px)] flex flex-col justify-between">
          {/* Desktop Full-Bleed Dominant Image */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[51%] xl:w-[53%] 2xl:w-[52%] h-full z-0 pointer-events-none select-none overflow-hidden">
            {/* Controlled soft transition gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-10 lg:w-16 xl:w-20 2xl:w-24 bg-gradient-to-r from-[#F9F9F8] to-transparent z-10" />
            <Image
              src="/customer/store-christa-counter.jpg"
              alt="Persönliche Beratung und Damenmode in der Checkpot Boutique Hietzing"
              fill
              priority
              sizes="(min-width: 1536px) 52vw, (min-width: 1280px) 53vw, 51vw"
              className="object-cover object-[center_28%] 2xl:object-[center_26%]"
            />
          </div>

          {/* Main Content Container */}
          <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 relative z-10 flex-1 flex flex-col justify-center">
            <div className="w-full lg:w-[53%] xl:w-[50%] 2xl:w-[48%]">
              <FadeIn duration={600} translateY={16} className="flex flex-col items-start">
                {/* Eyebrow with restrained red rule */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <span className="w-6 sm:w-8 h-[2px] bg-[#C01718]" aria-hidden="true" />
                  <span className="text-[12px] sm:text-[13px] 2xl:text-[14px] font-semibold uppercase tracking-[0.14em] 2xl:tracking-[0.16em] text-[#C01718]">
                    Boutique in Wien-Hietzing
                  </span>
                </div>

                {/* Expressive H1 with comfortable breathing room */}
                <h1 className="mb-4 sm:mb-6 font-display text-3xl sm:text-5xl lg:text-[66px] xl:text-[76px] 2xl:text-[84px] font-normal leading-[1.08] sm:leading-[1.05] 2xl:leading-[1.04] tracking-tight text-[#1A1A1A]">
                  <span>Besondere Mode.</span>
                  <br />
                  <span className="text-[#C01718] block mt-1">Persönlich beraten.</span>
                </h1>

                {/* Supporting Copy */}
                <p className="mb-6 sm:mb-8 lg:mb-10 max-w-[480px] 2xl:max-w-[530px] text-[16px] sm:text-xl 2xl:text-[21px] leading-relaxed text-[#4A5568]">
                  Ausgewählte Damenmode für Frauen, die ihren eigenen Stil tragen möchten – mit ehrlicher Beratung direkt in Wien-Hietzing.
                </p>

                {/* CTAs: Solid Primary Button + Refined Secondary Text Link */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                  <Link
                    href="#discovery"
                    className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-8 2xl:px-9 py-3.5 sm:py-4 2xl:py-4.5 text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white !text-white transition-colors duration-200 ease-out hover:bg-[#A01314] hover:text-white hover:!text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8] w-full sm:w-auto text-center"
                  >
                    <span className="text-white font-medium">Kollektion entdecken</span>
                  </Link>
                  <Link
                    href="/kontakt"
                    className="group inline-flex items-center justify-center sm:justify-start text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 self-start sm:self-auto"
                  >
                    Besuchen Sie uns <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Mobile / Tablet In-Flow Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#EFECE6] mt-6 sm:mt-8 lg:hidden">
              <Image
                src="/customer/store-christa-counter.jpg"
                alt="Persönliche Beratung und Damenmode in der Checkpot Boutique Hietzing"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover object-[center_24%]"
              />
            </div>
          </div>

          {/* Bottom Editorial Meta Strip with refined legibility */}
          <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-6 sm:pt-8 lg:pt-12 2xl:pt-14 relative z-10">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#2D3748]">
              <span>1130 Wien</span>
              <span className="text-[#C01718] font-bold" aria-hidden="true">·</span>
              <span>Seit 2009</span>
              <span className="text-[#C01718] font-bold" aria-hidden="true">·</span>
              <span>Persönliche Beratung</span>
            </div>
          </div>
        </section>

        {/* 2. FASHION / OUTFIT EXPERIENCE (SCROLL-DRIVEN HORIZONTAL GALLERY) */}
        <OutfitsHorizontalGallery outfits={homepageOutfits} />

        {/* 3. EDITORIAL BOUTIQUE MOMENT (ATMOSPHERE & PHYSICAL PLACE) */}
        <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] px-6 lg:px-8 2xl:px-12 py-10 sm:py-16 lg:py-20 xl:py-24">
          <div className="mx-auto max-w-[1360px]">
            
            {/* Header & Storytelling Introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-6 sm:mb-8 lg:mb-12">
              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                  <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
                  <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                    Einblicke in die Boutique
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] 2xl:text-[44px] font-normal leading-[1.12] text-[#1A1A1A] tracking-tight mb-2.5 sm:mb-3">
                  Ein Ort zum Entdecken.
                </h2>

                <p className="text-[15px] sm:text-[16.5px] 2xl:text-[17.5px] text-[#4A5568] leading-relaxed max-w-[480px]">
                  Farben, Muster und besondere Stücke – bei Checkpot können Sie in Ruhe stöbern, anprobieren und gemeinsam neue Kombinationen entdecken.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-end pb-0.5">
                <span className="text-[11.5px] font-mono font-medium tracking-[0.12em] text-[#718096] uppercase mb-2.5 sm:mb-3">
                  1130 Wien · Hietzinger Hauptstraße 10–16
                </span>
                <Link
                  href="/ueber-uns"
                  className="group inline-flex items-center text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Mehr über Checkpot <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Asymmetric 3-Photo Editorial Composition (1 Large + 2 Side-by-Side on mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-6 items-stretch">
              
              {/* Primary Wide Interior Image */}
              <div className="lg:col-span-7 xl:col-span-8 relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:min-h-[440px] xl:min-h-[460px] 2xl:min-h-[480px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
                <Image
                  src="/customer/store/20260820_110653.jpg"
                  alt="Großzügiger Innenraum der Checkpot Boutique in Wien-Hietzing mit warmen Holzregalen und Modeauswahl"
                  fill
                  sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 50%" }}
                />
              </div>

              {/* Supporting Offset Images: 2-column row on mobile/tablet, vertical stack on desktop */}
              <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-3 sm:gap-4 lg:gap-6 justify-between">
                {/* Detail Image */}
                <div className="relative aspect-[4/3] lg:aspect-[16/10] xl:aspect-[4/3] w-full h-auto lg:h-[210px] xl:h-[220px] 2xl:h-[230px] rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                  <Image
                    src="/customer/store/20260819_132541.jpg"
                    alt="Farbenfrohe Kleider und ausgewählte Damenmode auf Bügeln"
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 40%" }}
                  />
                </div>

                {/* Storefront / Physical Context Image */}
                <div className="relative aspect-[4/3] lg:aspect-[16/10] xl:aspect-[4/3] w-full h-auto lg:h-[210px] xl:h-[220px] 2xl:h-[230px] rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                  <Image
                    src="/customer/store/20260825_125300.jpg"
                    alt="Eingangsbereich und Schaufenster der Checkpot Boutique in der Hietzinger Hauptstraße"
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 25%" }}
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BRAND BOOKSHELF / DISCOVERY (15-BRAND INDEX + ACTIVE PREVIEW) */}
        <section className="bg-[#F8F7F3] border-b border-[#EDEAE4] px-6 lg:px-8 2xl:px-12 py-10 sm:py-16 lg:py-28 2xl:py-32">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <BrandBookshelf brands={featuredBrands} />
          </div>
        </section>

        {/* 5. CHRISTA / PERSONAL CONSULTATION — EDITORIAL TRUST MOMENT */}
        <section className="bg-[#FAF9F6] border-b border-[#EDEAE4] px-6 lg:px-8 2xl:px-12 py-10 sm:py-16 lg:py-20 xl:py-24 2xl:py-28">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-0 relative">
              
              {/* Left: Controlled Editorial Portrait */}
              <div className="w-full max-w-[340px] sm:max-w-[440px] lg:max-w-none lg:w-[40%] xl:w-[38%] 2xl:w-[37%] shrink-0">
                <FadeIn duration={600} translateY={16} className="relative aspect-[4/5] sm:aspect-[3.7/5] xl:aspect-[3.6/5] w-full max-h-[420px] sm:max-h-[520px] lg:max-h-[580px] 2xl:max-h-[660px] overflow-hidden rounded-sm bg-[#EFECE6] shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
                  <Image
                    src="/customer/christa-storefront.jpg"
                    alt="Christa vor der Checkpot Boutique in Wien-Hietzing"
                    fill
                    sizes="(min-width: 1536px) 37vw, (min-width: 1024px) 40vw, (max-width: 768px) 100vw, 480px"
                    className="object-cover object-[50%_18%] transition-transform duration-700 hover:scale-[1.02]"
                  />
                </FadeIn>
              </div>

              {/* Right: Refined Editorial Note & Personal Consultation Message */}
              <div className="w-full max-w-[580px] lg:max-w-none lg:w-[56%] xl:w-[58%] 2xl:w-[57%] lg:-ml-14 xl:-ml-18 2xl:-ml-20 relative z-10">
                <FadeIn delay={120} duration={600} translateY={16} className="bg-white border border-[#E5E2DC] rounded-sm p-5 sm:p-7 lg:p-9 xl:p-11 2xl:p-13 shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative">
                  {/* Subtle pale red typographic quote accent */}
                  <span
                    className="select-none pointer-events-none absolute -top-4 sm:-top-5 -left-2 sm:-left-3 font-serif text-[60px] sm:text-[100px] 2xl:text-[120px] leading-none text-[#C01718]/10"
                    aria-hidden="true"
                  >
                    „
                  </span>

                  {/* Eyebrow */}
                  <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3.5 relative z-10">
                    <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
                    <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                      Persönlich für Sie
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h2 className="mb-3 sm:mb-4 font-display text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] 2xl:text-[46px] font-normal leading-[1.14] tracking-tight text-[#1A1A1A] relative z-10">
                    Beratung, die von Herzen kommt.
                  </h2>

                  {/* Body Copy */}
                  <p className="mb-4 sm:mb-6 lg:mb-7 text-[14.5px] sm:text-[16.5px] 2xl:text-[18px] leading-relaxed text-[#4A5568] relative z-10 max-w-lg">
                    Mode ist für mich mehr als Kleidung. Gemeinsam finden wir Farben, Schnitte und Kombinationen, in denen Sie sich wirklich wohlfühlen – entspannt, ehrlich und mit Zeit für Sie.
                  </p>

                  {/* Personal Sign-Off & Quiet Link */}
                  <div className="pt-3 sm:pt-4 border-t border-[#ECEAE4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 relative z-10">
                    <span className="font-display text-lg sm:text-xl 2xl:text-2xl font-medium text-[#C01718]">
                      Ihre Christa
                    </span>

                    <Link
                      href="/ueber-uns"
                      className="group inline-flex items-center text-[12.5px] 2xl:text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 self-start sm:self-auto focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      Mehr über Checkpot <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        {/* 6. VISIT CHECKPOT — PHYSICAL STORE INVITATION */}
        <section className="bg-[#1A1A1A] text-white px-6 lg:px-8 2xl:px-12 py-10 sm:py-14 lg:py-16 xl:py-20 2xl:py-24 border-b border-[#2A2A2A]">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] xl:grid-cols-[1fr_1.1fr] 2xl:grid-cols-[1fr_1.15fr] gap-8 lg:gap-12 xl:gap-16 items-start lg:items-center">
              
              {/* Left Column: Location, Hours & Route Action */}
              <FadeIn duration={600} translateY={16} className="flex flex-col">
                {/* Eyebrow */}
                <div className="flex items-center gap-2.5 mb-2 sm:mb-2.5 2xl:mb-3">
                  <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
                  <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                    Hier bin ich gut aufgehoben
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="mb-4 sm:mb-6 2xl:mb-8 font-display text-2xl sm:text-4xl lg:text-[38px] xl:text-[42px] 2xl:text-[48px] font-normal leading-[1.14] tracking-tight text-white">
                  Besuchen Sie uns<br />in Wien-Hietzing.
                </h2>

                {/* Information Grid: Address & Opening Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 pb-5 sm:pb-6 border-b border-white/10">
                  {/* Address */}
                  <div>
                    <h3 className="mb-1 text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">
                      Adresse
                    </h3>
                    <p className="text-[14.5px] sm:text-[16.5px] 2xl:text-[18px] leading-relaxed text-white/90">
                      {storeDetails.address.street}
                      <br />
                      {storeDetails.address.postalCode} {storeDetails.address.city}
                    </p>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h3 className="mb-1 text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">
                      Öffnungszeiten
                    </h3>
                    <div className="space-y-1 text-[14px] sm:text-[15.5px] 2xl:text-[17px] leading-relaxed text-white/90">
                      {storeDetails.hours.map((hour) => (
                        <div key={hour.label} className="flex items-baseline justify-between sm:justify-start sm:gap-4">
                          <span className="text-white/60 text-[12.5px] sm:text-[14px]">{hour.label}</span>
                          <span className="font-medium text-white/95">{hour.value}</span>
                        </div>
                      ))}
                    </div>
                    {storeDetails.hoursNote && (
                      <p className="mt-1 text-[12px] leading-relaxed text-white/60 italic">
                        {storeDetails.hoursNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Primary Action */}
                <div className="mt-5 sm:mt-6">
                  <a
                    href={storeDetails.routePlanningHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-sm bg-white px-6 py-3 2xl:px-7 2xl:py-3.5 text-[12.5px] 2xl:text-[13px] font-medium uppercase tracking-[0.08em] !text-[#1A1A1A] transition-colors duration-200 hover:bg-[#F0EEEA] hover:!text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] min-h-[44px]"
                  >
                    Route planen <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">↗</span>
                  </a>
                </div>
              </FadeIn>

              {/* Right Column: Controlled High-Presence Store Image (Hidden on Mobile) */}
              <FadeIn delay={120} duration={600} translateY={16} className="hidden lg:block relative aspect-[1.3/1] xl:aspect-[1.35/1] 2xl:aspect-[1.38/1] w-full max-h-[480px] xl:max-h-[520px] 2xl:max-h-[580px] overflow-hidden rounded-sm bg-[#262626] shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
                <Image
                  src="/customer/store-sustainable-shelf.jpg"
                  alt="Atmosphäre und Kollektionen in der Checkpot Boutique in Wien-Hietzing"
                  fill
                  sizes="(min-width: 1536px) 48vw, (min-width: 1024px) 50vw, 0px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </FadeIn>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}
