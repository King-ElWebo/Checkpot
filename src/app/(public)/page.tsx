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
        <section className="relative w-full overflow-hidden bg-[#F9F9F8] pt-8 lg:pt-14 xl:pt-16 2xl:pt-20 pb-12 lg:pb-16 xl:pb-20 2xl:pb-24 min-h-[calc(84vh-80px)] 2xl:min-h-[calc(86vh-80px)] flex flex-col justify-between">
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
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[2px] bg-[#C01718]" aria-hidden="true" />
                  <span className="text-[12px] sm:text-[13px] 2xl:text-[14px] font-semibold uppercase tracking-[0.14em] 2xl:tracking-[0.16em] text-[#C01718]">
                    Boutique in Wien-Hietzing
                  </span>
                </div>

                {/* Expressive H1 with comfortable breathing room */}
                <h1 className="mb-6 font-display text-4xl sm:text-5xl lg:text-[66px] xl:text-[76px] 2xl:text-[84px] font-normal leading-[1.05] 2xl:leading-[1.04] tracking-tight text-[#1A1A1A]">
                  <span>Besondere Mode.</span>
                  <br />
                  <span className="text-[#C01718] block mt-1">Persönlich beraten.</span>
                </h1>

                {/* Supporting Copy */}
                <p className="mb-8 lg:mb-10 max-w-[480px] 2xl:max-w-[530px] text-lg sm:text-xl 2xl:text-[21px] leading-relaxed text-[#4A5568]">
                  Ausgewählte Damenmode für Frauen, die ihren eigenen Stil tragen möchten – mit ehrlicher Beratung direkt in Wien-Hietzing.
                </p>

                {/* CTAs: Solid Primary Button + Refined Secondary Text Link */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 w-full sm:w-auto">
                  <Link
                    href="#discovery"
                    className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-8 2xl:px-9 py-4 2xl:py-4.5 text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white !text-white transition-colors duration-200 ease-out hover:bg-[#A01314] hover:text-white hover:!text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8]"
                  >
                    <span className="text-white font-medium">Kollektion entdecken</span>
                  </Link>
                  <Link
                    href="/kontakt"
                    className="group inline-flex items-center text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
                  >
                    Besuchen Sie uns <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Mobile / Tablet In-Flow Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#EFECE6] mt-8 lg:hidden">
              <Image
                src="/customer/store-christa-counter.jpg"
                alt="Persönliche Beratung und Damenmode in der Checkpot Boutique Hietzing"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover object-[center_28%]"
              />
            </div>
          </div>

          {/* Bottom Editorial Meta Strip with refined legibility */}
          <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-8 lg:pt-12 2xl:pt-14 relative z-10">
            <div className="flex items-center gap-3 text-[12px] sm:text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.16em] text-[#2D3748]">
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

        {/* 3. BRAND BOOKSHELF / DISCOVERY (15-BRAND INDEX + ACTIVE PREVIEW) */}
        <section className="bg-[#F8F7F3] border-b border-[#EDEAE4] px-6 lg:px-8 2xl:px-12 py-20 lg:py-28 2xl:py-32">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <BrandBookshelf brands={featuredBrands} />
          </div>
        </section>

        {/* 4. CHRISTA / PERSONAL CONSULTATION — EDITORIAL TRUST MOMENT */}
        <section className="bg-[#FAF9F6] border-b border-[#EDEAE4] px-6 lg:px-8 2xl:px-12 py-16 lg:py-20 xl:py-24 2xl:py-28">
          <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 relative">
              
              {/* Left: Controlled Editorial Portrait */}
              <div className="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-none lg:w-[40%] xl:w-[38%] 2xl:w-[37%] shrink-0">
                <FadeIn duration={600} translateY={16} className="relative aspect-[3.7/5] xl:aspect-[3.6/5] w-full max-h-[580px] 2xl:max-h-[660px] overflow-hidden rounded-sm bg-[#EFECE6] shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
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
                <FadeIn delay={120} duration={600} translateY={16} className="bg-white border border-[#E5E2DC] rounded-sm p-7 sm:p-8 lg:p-9 xl:p-11 2xl:p-13 shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative">
                  {/* Subtle pale red typographic quote accent */}
                  <span
                    className="select-none pointer-events-none absolute -top-4 sm:-top-5 -left-2 sm:-left-3 font-serif text-[80px] sm:text-[100px] 2xl:text-[120px] leading-none text-[#C01718]/10"
                    aria-hidden="true"
                  >
                    „
                  </span>

                  {/* Eyebrow */}
                  <div className="flex items-center gap-2.5 mb-3.5 relative z-10">
                    <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
                    <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                      Persönlich für Sie
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] 2xl:text-[46px] font-normal leading-[1.14] tracking-tight text-[#1A1A1A] relative z-10">
                    Beratung, die von Herzen kommt.
                  </h2>

                  {/* Body Copy */}
                  <p className="mb-6 lg:mb-7 text-[15px] sm:text-[16.5px] 2xl:text-[18px] leading-relaxed text-[#4A5568] relative z-10 max-w-lg">
                    Mode ist für mich mehr als Kleidung. Gemeinsam finden wir Farben, Schnitte und Kombinationen, in denen Sie sich wirklich wohlfühlen – entspannt, ehrlich und mit Zeit für Sie.
                  </p>

                  {/* Personal Sign-Off & Quiet Link */}
                  <div className="pt-4 border-t border-[#ECEAE4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                    <span className="font-display text-xl 2xl:text-2xl font-medium text-[#C01718]">
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

        {/* 5. VISIT CHECKPOT */}
        <section className="bg-[#1A1A1A] px-4 py-16 text-white lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              
              <div className="flex flex-col">
                <span className="mb-4 block text-[14px] font-medium uppercase tracking-wider text-[#C01718]">
                  Hier bin ich gut aufgehoben
                </span>
                <h2 className="mb-10 font-display text-4xl font-normal tracking-tight sm:text-5xl">
                  Besuchen Sie uns
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white/50">Adresse</h3>
                    <p className="text-[17px] leading-relaxed text-white/90">
                      {storeDetails.name}<br />
                      {storeDetails.address.street}<br />
                      {storeDetails.address.postalCode} {storeDetails.address.city}
                    </p>
                    <a 
                      href={storeDetails.routePlanningHref} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-[15px] font-medium text-white hover:text-[#C01718] transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-[#C01718]"
                    >
                      Route planen ↗
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white/50">Öffnungszeiten</h3>
                    <div className="space-y-3">
                      {storeDetails.hours.map((hour) => (
                        <p key={hour.label} className="text-[17px] leading-relaxed text-white/90">
                          {hour.label}<br />
                          {hour.value}
                        </p>
                      ))}
                      {storeDetails.hoursNote && (
                        <p className="text-[14px] leading-relaxed text-white/70 italic pt-1">
                          {storeDetails.hoursNote}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <h3 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white/50">Kontakt</h3>
                    <p className="text-[17px] leading-relaxed text-white/90">
                      <a href={storeDetails.phoneHref} className="hover:text-[#C01718] transition-colors">{storeDetails.phone}</a><br />
                      <a href={storeDetails.emailHref} className="hover:text-[#C01718] transition-colors">{storeDetails.email}</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm lg:aspect-[4/5] bg-[#333]">
                <Image
                  src="/customer/store-sustainable-shelf.jpg"
                  alt="Atmosphäre im Checkpot Store"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}
