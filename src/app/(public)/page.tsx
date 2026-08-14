import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/public/motion/fade-in";
import { storeDetails, siteUrl } from "@/content/fixtures/checkpot";
import { listFeaturedOutfits } from "@/lib/repositories/outfits";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { BrandBookshelf } from "@/components/public/brand-bookshelf";

export default async function HomePage() {
  const dbOutfits = await listFeaturedOutfits();
  const dbBrands = await listPublishedBrands();
  
  const featuredOutfits = dbOutfits.slice(0, 3);
  const featuredBrands = dbBrands; // Use all published brands for robustness

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeDetails.name,
    image: new URL("/customer/christa-storefront.jpg", siteUrl).toString(),
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
        <section className="relative mx-auto w-full max-w-[1400px] px-4 py-12 lg:px-8 lg:py-24 overflow-hidden">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <FadeIn duration={600} translateY={20} className="relative z-10 flex flex-col justify-center">
              <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
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
                  className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-4 text-[15px] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8]"
                >
                  Kollektion entdecken
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-8 py-4 text-[15px] font-medium text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F3F2EE] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8]"
                >
                  Besuchen Sie uns
                </Link>
              </div>
            </FadeIn>
            
            {/* Art-directed composition with restrained overlap */}
            <FadeIn delay={150} duration={800} className="relative z-0 h-[600px] w-full lg:h-[700px]">
              {/* Store Image (Main) */}
              <div className="absolute right-0 top-0 h-[80%] w-[85%] overflow-hidden rounded-2xl shadow-sm">
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
              <div className="absolute bottom-0 left-0 h-[65%] w-[55%] overflow-hidden rounded-2xl border-8 border-[#F9F9F8] shadow-lg lg:-left-12">
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
        <section id="discovery" className="bg-white px-4 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 max-w-2xl">
              <h2 className="mb-6 font-display text-4xl font-normal tracking-tight text-[#1A1A1A] sm:text-5xl">
                Ausgesuchte Mode<br />mit Persönlichkeit
              </h2>
              <p className="text-xl leading-relaxed text-[#4A5568]">
                Wir kuratieren Kollektionen, die Ihre Ausstrahlung unterstreichen. 
                Entdecken Sie unerwartete Kombinationen in einer entspannten Umgebung.
              </p>
            </div>
            
            {featuredOutfits.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 lg:gap-16">
                {/* Asymmetric composition */}
                {featuredOutfits[0] && (
                  <Link href={`/outfits`} className="group md:col-span-7 flex flex-col focus:outline-hidden">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F9F9F8]">
                      {featuredOutfits[0].media && (
                        <Image
                          src={featuredOutfits[0].media.url}
                          alt={featuredOutfits[0].media.alt || featuredOutfits[0].title}
                          fill
                          sizes="(min-width: 768px) 60vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          style={featuredOutfits[0].media.focalPoint ? { objectPosition: featuredOutfits[0].media.focalPoint } : {}}
                        />
                      )}
                    </div>
                    <div className="mt-6 flex flex-col items-start">
                      <h3 className="font-display text-2xl text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                        {featuredOutfits[0].title}
                      </h3>
                      {featuredOutfits[0].note && (
                        <p className="mt-2 text-lg text-[#4A5568]">{featuredOutfits[0].note}</p>
                      )}
                    </div>
                  </Link>
                )}
                
                <div className="flex flex-col gap-12 md:col-span-5 md:mt-32">
                  {featuredOutfits.slice(1, 3).map((outfit) => (
                    <Link key={outfit.id} href={`/outfits`} className="group flex flex-col focus:outline-hidden">
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F9F9F8]">
                        {outfit.media && (
                          <Image
                            src={outfit.media.url}
                            alt={outfit.media.alt || outfit.title}
                            fill
                            sizes="(min-width: 768px) 40vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            style={outfit.media.focalPoint ? { objectPosition: outfit.media.focalPoint } : {}}
                          />
                        )}
                      </div>
                      <div className="mt-5 flex flex-col items-start">
                        <h3 className="font-display text-xl text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                          {outfit.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-lg text-[#4A5568] bg-[#F9F9F8] rounded-2xl">
                Derzeit sind keine Outfits verfügbar.
              </div>
            )}
            
            <div className="mt-16 text-center">
              <Link
                href="/outfits"
                className="inline-flex items-center text-[14px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors"
              >
                Alle Outfits ansehen <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. BRAND BOOKSHELF / DISCOVERY */}
        <section className="bg-[#F9F9F8] px-4 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 text-center">
              <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                Stöbern in Christas Auswahl
              </span>
              <h2 className="font-display text-4xl font-normal tracking-tight text-[#1A1A1A] sm:text-5xl">
                Unsere Marken entdecken
              </h2>
            </div>
            
            <BrandBookshelf brands={featuredBrands} />

            <div className="mt-16 text-center">
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
        <section className="bg-white px-4 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-24">
              <FadeIn className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F9F9F8]">
                <Image
                  src="/customer/christa-storefront.jpg"
                  alt="Christa vor dem Checkpot Hietzing"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </FadeIn>
              
              <FadeIn delay={150} className="flex flex-col">
                <h2 className="mb-8 font-display text-4xl font-normal leading-[1.2] tracking-tight text-[#1A1A1A] sm:text-5xl">
                  Beratung, die<br />von Herzen kommt
                </h2>
                <div className="space-y-6 text-xl leading-relaxed text-[#4A5568]">
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
                <div className="mt-12">
                  <span className="font-display text-2xl font-medium text-[#C01718]">
                    Ihre Christa
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 5. VISIT CHECKPOT */}
        <section className="bg-[#1A1A1A] px-4 py-20 text-white lg:px-8 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">
              
              <div className="flex flex-col">
                <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                  Hier bin ich gut aufgehoben
                </span>
                <h2 className="mb-12 font-display text-4xl font-normal tracking-tight sm:text-5xl">
                  Besuchen Sie uns
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div>
                    <h3 className="mb-3 text-[14px] font-medium uppercase tracking-[0.08em] text-white/50">Adresse</h3>
                    <p className="text-lg leading-relaxed text-white/90">
                      Checkpot Hietzing<br />
                      Lainzer Straße 12<br />
                      1130 Wien
                    </p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Checkpot+Hietzing+Lainzer+Straße+12+1130+Wien" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-[15px] font-medium text-white hover:text-[#C01718] transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-[#C01718]"
                    >
                      Route planen ↗
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="mb-3 text-[14px] font-medium uppercase tracking-[0.08em] text-white/50">Öffnungszeiten</h3>
                    <p className="text-lg leading-relaxed text-white/90">
                      Montag – Freitag<br />
                      10:00 – 18:00 Uhr
                    </p>
                    <p className="mt-3 text-lg leading-relaxed text-white/90">
                      Samstag<br />
                      10:00 – 14:00 Uhr
                    </p>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <h3 className="mb-3 text-[14px] font-medium uppercase tracking-[0.08em] text-white/50">Kontakt</h3>
                    <p className="text-lg leading-relaxed text-white/90">
                      +43 (0)1 877 00 00<br />
                      office@checkpot.at
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square w-full overflow-hidden rounded-2xl lg:aspect-[4/5]">
                <Image
                  src="/customer/store-detail-flowers.jpg"
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
