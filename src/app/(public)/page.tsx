import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/public/motion/fade-in";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { getSiteUrl } from "@/lib/site-config";
import { listFeaturedOutfits } from "@/lib/repositories/outfits";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { BrandBookshelf } from "@/components/public/brand-bookshelf";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [storeDetails, dbOutfits, dbBrands] = await Promise.all([
    getStoreDetails(),
    listFeaturedOutfits(),
    listPublishedBrands(),
  ]);

  const siteUrl = getSiteUrl();
  
  const featuredOutfits = dbOutfits.slice(0, 3);
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
        
        {/* 1. HERO — STORE FIRST, FASHION IMMEDIATELY VISIBLE */}
        <section className="relative mx-auto w-full max-w-[1400px] px-4 py-8 lg:px-8 lg:py-16 overflow-hidden">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <FadeIn duration={600} translateY={20} className="relative z-10 flex flex-col justify-center">
              <span className="mb-4 block text-[14px] font-medium uppercase tracking-wider text-[#C01718]">
                Boutique in Wien-Hietzing
              </span>
              <h1 className="mb-6 font-display text-5xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-6xl lg:text-7xl">
                Willkommen bei<br />Checkpot Hietzing
              </h1>
              <p className="mb-10 max-w-lg text-xl leading-relaxed text-[#4A5568]">
                Etwas Besonderes entdecken – und sich trotzdem sofort gut aufgehoben fühlen. 
                Persönliche Beratung und handverlesene Damenmode für Ihren individuellen Stil.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#discovery"
                  className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8]"
                >
                  Kollektion entdecken
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-sm border border-[#E2E8F0] bg-white px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F3F2EE] hover:border-[#1A1A1A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8]"
                >
                  Besuchen Sie uns
                </Link>
              </div>
            </FadeIn>
            
            {/* Art-directed composition with restrained overlap */}
            <FadeIn delay={150} duration={800} className="relative z-0 h-[500px] w-full lg:h-[650px]">
              {/* Store Image (Main) */}
              <div className="absolute right-0 top-0 h-[85%] w-[80%] overflow-hidden rounded-sm shadow-sm">
                <Image
                  src="/customer/store-christa-counter.jpg"
                  alt="Checkpot Boutique Innenraum"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Fashion Image (Overlap) */}
              <div className="absolute bottom-0 left-0 h-[65%] w-[60%] overflow-hidden rounded-sm border-8 border-[#F9F9F8] shadow-md lg:-left-6">
                <Image
                  src="/customer/outfit-blue-summer.jpg"
                  alt="Modisches Sommer-Outfit in Blau"
                  fill
                  priority
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover object-top"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 2. FASHION / OUTFIT EXPERIENCE */}
        <section id="discovery" className="bg-white px-4 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="mb-6 font-display text-4xl font-normal tracking-tight text-[#1A1A1A] sm:text-5xl">
                  Ausgesuchte Mode<br />mit Persönlichkeit
                </h2>
                <p className="text-xl leading-relaxed text-[#4A5568]">
                  Wir kuratieren Kollektionen, die Ihre Ausstrahlung unterstreichen. 
                  Entdecken Sie unerwartete Kombinationen in einer entspannten Umgebung.
                </p>
              </div>
              <div className="hidden lg:block pb-2">
                <Link
                  href="/outfits"
                  className="inline-flex items-center text-[14px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors"
                >
                  Alle Outfits ansehen <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
            
            {featuredOutfits.length > 0 ? (
              <div className={`grid gap-8 lg:gap-12 ${
                featuredOutfits.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
                featuredOutfits.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" :
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {featuredOutfits.map((outfit) => (
                  <div key={outfit.id} className="group flex flex-col gap-4 transition-transform duration-[400ms] ease-out hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <Link href="/outfits" className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F8] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A]">
                      {outfit.media && (
                        <Image
                          src={outfit.media.url}
                          alt={outfit.media.alt || outfit.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          style={outfit.media.focalPoint ? { objectPosition: outfit.media.focalPoint } : {}}
                        />
                      )}
                    </Link>
                    
                    <div className="flex flex-col items-start gap-1">
                      <Link href="/outfits" className="focus:outline-hidden">
                        <h3 className="font-display text-xl font-medium text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C01718]">
                          {outfit.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-lg text-[#4A5568] bg-[#F9F9F8] rounded-sm">
                Derzeit sind keine Outfits verfügbar.
              </div>
            )}
            
            <div className="mt-12 text-center lg:hidden">
              <Link
                href="/outfits"
                className="inline-flex items-center justify-center rounded-sm border border-[#E2E8F0] bg-white px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F3F2EE] hover:border-[#1A1A1A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
              >
                Alle Outfits ansehen
              </Link>
            </div>
          </div>
        </section>

        {/* 3. BRAND BOOKSHELF / DISCOVERY */}
        <section className="bg-[#F9F9F8] px-4 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 text-center">
              <span className="mb-4 block text-[14px] font-medium uppercase tracking-wider text-[#C01718]">
                Stöbern in Christas Auswahl
              </span>
              <h2 className="font-display text-4xl font-normal tracking-tight text-[#1A1A1A] sm:text-5xl">
                Unsere Marken entdecken
              </h2>
            </div>
            
            <BrandBookshelf brands={featuredBrands} />

            <div className="mt-12 text-center">
              <Link
                href="/marken"
                className="inline-flex items-center text-[14px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors"
              >
                Zur Markenübersicht <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. CHRISTA / PERSONAL CONSULTATION */}
        <section className="bg-white px-4 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <FadeIn className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#E2E8F0]">
                <Image
                  src="/customer/christa-storefront.jpg"
                  alt="Christa vor dem Checkpot Hietzing"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 25%" }}
                />
              </FadeIn>
              
              <FadeIn delay={150} className="flex flex-col">
                <h2 className="mb-8 font-display text-4xl font-normal leading-[1.2] tracking-tight text-[#1A1A1A] sm:text-5xl">
                  Beratung, die<br />von Herzen kommt
                </h2>
                <div className="space-y-6 text-[17px] lg:text-xl leading-relaxed text-[#4A5568]">
                  <p>
                    Mode ist für mich mehr als Kleidung. Es ist die Freude daran, das perfekte Teil 
                    zu finden, das Ihre Persönlichkeit und Ihre Ausstrahlung unterstreicht.
                  </p>
                  <p>
                    Bei einem gemütlichen Kaffee nehme ich mir Zeit für Sie. 
                    Gemeinsam finden wir heraus, welche Schnitte, Farben und Kombinationen 
                    wirklich zu Ihnen passen – ohne Hektik und mit viel Liebe zum Detail.
                  </p>
                </div>
                <div className="mt-10">
                  <span className="font-display text-2xl font-medium text-[#C01718]">
                    Ihre Christa
                  </span>
                </div>
              </FadeIn>
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
