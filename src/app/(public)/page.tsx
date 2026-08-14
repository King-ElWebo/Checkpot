import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/public/motion/fade-in";
import { StaggeredList } from "@/components/public/motion/staggered-list";
import { storeDetails, imagery, outfits, brands, siteUrl } from "@/content/fixtures/checkpot";

export default function HomePage() {
  const featuredOutfits = outfits.filter((o) => o.featured).slice(0, 3);
  const featuredBrands = brands.filter((b) => b.active).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeDetails.name,
    image: new URL(imagery.hero.src, siteUrl).toString(),
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
      <div className="flex flex-col">
        
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-[1400px] px-4 py-12 lg:px-6 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn duration={600} translateY={10} className="flex flex-col justify-center">
              <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
                Boutique in Wien
              </span>
              <h1 className="mb-6 text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
                Willkommen bei Checkpot Hietzing
              </h1>
              <p className="mb-10 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
                Entdecken Sie hochwertige, feminine Damenmode in einer Atmosphäre, die zur
                persönlichen Stilberatung einlädt.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/outfits"
                  className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
                >
                  Outfits ansehen
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-md bg-[#F9F9F8] px-8 py-3.5 text-[15px] font-medium text-[#1A1A1A] transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                >
                  Geschäft besuchen
                </Link>
              </div>
            </FadeIn>
            
            <FadeIn delay={150} duration={600} translateY={10} className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
              <Image
                src={imagery.hero.src}
                alt={imagery.hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.hero.objectPosition }}
              />
            </FadeIn>
          </div>
        </section>

        {/* Featured Outfits Section */}
        <section className="bg-[#F9F9F8] px-4 py-20 lg:px-6 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-16">
              <div>
                <span className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
                  Die Auswahl
                </span>
                <h2 className="text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
                  Outfit-Inspirationen
                </h2>
              </div>
              <Link
                href="/outfits"
                className="group inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                Alle Outfits <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
            
            <StaggeredList className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={100}>
              {featuredOutfits.map((outfit) => (
                <Link
                  key={outfit.title}
                  href="/outfits"
                  className="group flex flex-col gap-4 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-white">
                    <Image
                      src={outfit.image.src}
                      alt={outfit.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      style={{ objectPosition: outfit.image.objectPosition }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                      {outfit.title}
                    </h3>
                    <p className="mt-1 text-[15px] text-[#4A5568]">{outfit.note}</p>
                  </div>
                </Link>
              ))}
            </StaggeredList>
          </div>
        </section>

        {/* About & Trust Section */}
        <section className="mx-auto w-full max-w-[1400px] px-4 py-20 lg:px-6 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#F9F9F8] lg:order-2">
              <Image
                src={imagery.founder.src}
                alt={imagery.founder.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.founder.objectPosition }}
              />
            </FadeIn>
            
            <FadeIn delay={150} className="flex flex-col justify-center lg:order-1">
              <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
                Unsere Philosophie
              </span>
              <h2 className="mb-6 text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
                Persönliche Stilberatung seit 2009
              </h2>
              <div className="space-y-6 text-lg text-[#4A5568]">
                <p>
                  Bei Checkpot steht nicht der schnelle Einkauf im Vordergrund, sondern die
                  individuelle Beratung. {storeDetails.owner} und ihr Team nehmen sich Zeit, um
                  gemeinsam mit Ihnen herauszufinden, welche Farben, Schnitte und Kombinationen am
                  besten zu Ihrem Typ passen.
                </p>
                <p>
                  Wir glauben daran, dass gute Kleidung mehr ist als nur ein Trend. Sie soll
                  unterstreichen, wer Sie sind – nachhaltig, hochwertig und mit einem Lächeln
                  ausgesucht.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/ueber-uns"
                  className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
                >
                  Über Checkpot & Christa
                </Link>
                <Link
                  href="/fair-trade"
                  className="inline-flex items-center justify-center rounded-md bg-[#F9F9F8] px-8 py-3.5 text-[15px] font-medium text-[#1A1A1A] transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                >
                  Nachhaltigkeit entdecken
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Featured Brands Section */}
        <section className="bg-white px-4 py-20 lg:px-6 lg:py-28 border-t border-[#E2E8F0]">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 text-center lg:mb-16">
              <span className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
                Partner
              </span>
              <h2 className="text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
                Unsere Marken
              </h2>
            </div>
            
            <StaggeredList className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" staggerDelay={50}>
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/marken/${brand.slug}`}
                  className="group block rounded-md bg-[#F9F9F8] p-8 text-center transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  <h3 className="text-xl font-normal tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#C01718] sm:text-2xl">
                    {brand.name}
                  </h3>
                </Link>
              ))}
            </StaggeredList>

            <div className="mt-12 text-center">
              <Link
                href="/marken"
                className="group inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors hover:text-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                Zur Markenübersicht <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
