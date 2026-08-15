import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedCollections } from "@/lib/repositories/collections";

const seo = seoRoutes.find((r) => r.route === "/mode")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default async function ModePage() {
  const collections = await listPublishedCollections();
  const currentCollection = collections.find(c => c.featured) || collections[0];

  if (!currentCollection) {
    return (
      <div className="flex flex-col bg-white min-h-[60vh]">
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-8 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Mode", href: "/mode" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center">
          <h1 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] mb-6">Demnächst neue Kollektionen</h1>
          <p className="text-[17px] text-[#4A5568] max-w-xl mb-10 leading-relaxed">
            Wir arbeiten gerade daran, die neuesten Stücke für Sie zu kuratieren. In der Zwischenzeit können Sie sich von unseren bestehenden Outfits inspirieren lassen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/outfits"
              className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
            >
              Outfits ansehen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rawImages = currentCollection.outfits.map(o => o.media);
  const images = rawImages.filter((m): m is NonNullable<typeof rawImages[number]> => m !== null);
  
  // If season is just a year (e.g. "2026"), we don't emphasize it as a red eyebrow, but incorporate it into the title.
  const isJustYear = currentCollection.season && /^\d{4}$/.test(currentCollection.season.trim());

  if (images.length === 0) {
    return (
      <div className="flex flex-col bg-white min-h-[60vh]">
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-8 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Mode", href: "/mode" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center">
          {!isJustYear && currentCollection.season && (
            <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
              {currentCollection.season}
            </span>
          )}
          <h1 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight mb-4">
            {currentCollection.title}
            {isJustYear && <span className="block text-2xl lg:text-3xl text-[#4A5568] mt-2">{currentCollection.season}</span>}
          </h1>
          {currentCollection.intro ? (
            <p className="text-[17px] text-[#4A5568] leading-relaxed max-w-xl mb-10">
              {currentCollection.intro}
            </p>
          ) : (
            <p className="text-[17px] text-[#4A5568] leading-relaxed max-w-xl mb-10 mt-4">
              Die Bildauswahl für diese Kollektion wird in Kürze ergänzt.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/outfits"
              className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
            >
              Outfits ansehen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Mode", href: "/mode" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 lg:px-8 lg:pb-24">
        
        {/* LAYOUT LOGIC BASED ON IMAGE COUNT */}
        
        {images.length === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mt-6 lg:mt-8">
            <div className="lg:col-span-5 lg:order-2 flex flex-col pt-2 lg:pt-12">
              {!isJustYear && currentCollection.season && (
                <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                  {currentCollection.season}
                </span>
              )}
              <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-6 leading-[1.1]">
                {currentCollection.title}
                {isJustYear && <span className="block text-3xl lg:text-4xl text-[#4A5568] mt-2">{currentCollection.season}</span>}
              </h1>
              {currentCollection.intro && (
                <p className="text-[17px] lg:text-xl text-[#4A5568] leading-relaxed max-w-lg mb-10">
                  {currentCollection.intro}
                </p>
              )}
              
              <div className="relative aspect-[4/3] w-full max-w-[280px] overflow-hidden rounded-sm bg-[#E2E8F0] hidden lg:block">
                <Image
                  src="/customer/store-sustainable-shelf.jpg"
                  alt="Atmosphäre Checkpot"
                  fill
                  sizes="(min-width: 1024px) 25vw, 0vw"
                  className="object-cover grayscale-[20%]"
                />
              </div>
            </div>
            
            <div className="lg:col-span-7 lg:order-1 relative">
              <div className="relative aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#F9F9F8]">
                <Image
                  src={images[0].url}
                  alt={images[0].alt || currentCollection.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                  style={images[0].focalPoint ? { objectPosition: images[0].focalPoint } : {}}
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6 lg:mt-8">
            <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-12">
              {!isJustYear && currentCollection.season && (
                <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                  {currentCollection.season}
                </span>
              )}
              <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-6 leading-[1.1]">
                {currentCollection.title}
                {isJustYear && <span className="block text-3xl lg:text-4xl text-[#4A5568] mt-2">{currentCollection.season}</span>}
              </h1>
              {currentCollection.intro && (
                <p className="text-[17px] lg:text-xl text-[#4A5568] leading-relaxed max-w-lg mb-12">
                  {currentCollection.intro}
                </p>
              )}
              
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F8]">
                <Image
                  src={images[1].url}
                  alt={images[1].alt || `${currentCollection.title} 2`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  style={images[1].focalPoint ? { objectPosition: images[1].focalPoint } : {}}
                />
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F8]">
                <Image
                  src={images[0].url}
                  alt={images[0].alt || `${currentCollection.title} 1`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                  style={images[0].focalPoint ? { objectPosition: images[0].focalPoint } : {}}
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {images.length === 3 && (
          <div className="flex flex-col mt-6 lg:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-10 lg:mb-16">
              <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8">
                {!isJustYear && currentCollection.season && (
                  <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                    {currentCollection.season}
                  </span>
                )}
                <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-6 leading-[1.1]">
                  {currentCollection.title}
                  {isJustYear && <span className="block text-3xl lg:text-4xl text-[#4A5568] mt-2">{currentCollection.season}</span>}
                </h1>
                {currentCollection.intro && (
                  <p className="text-[17px] lg:text-xl text-[#4A5568] leading-relaxed max-w-lg">
                    {currentCollection.intro}
                  </p>
                )}
              </div>
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/5] lg:aspect-[16/9] w-full overflow-hidden rounded-sm bg-[#F9F9F8]">
                  <Image
                    src={images[0].url}
                    alt={images[0].alt || `${currentCollection.title} 1`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                    style={images[0].focalPoint ? { objectPosition: images[0].focalPoint } : {}}
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F8]">
                <Image
                  src={images[1].url}
                  alt={images[1].alt || `${currentCollection.title} 2`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={images[1].focalPoint ? { objectPosition: images[1].focalPoint } : {}}
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F8] lg:mt-24">
                <Image
                  src={images[2].url}
                  alt={images[2].alt || `${currentCollection.title} 3`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={images[2].focalPoint ? { objectPosition: images[2].focalPoint } : {}}
                />
              </div>
            </div>
          </div>
        )}

        {images.length >= 4 && (
          <div className="flex flex-col mt-6 lg:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 lg:mb-16">
              <div className="lg:col-span-6 flex flex-col pt-2">
                {!isJustYear && currentCollection.season && (
                  <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                    {currentCollection.season}
                  </span>
                )}
                <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-2 leading-[1.1]">
                  {currentCollection.title}
                  {isJustYear && <span className="block text-3xl lg:text-4xl text-[#4A5568] mt-2">{currentCollection.season}</span>}
                </h1>
              </div>
              {currentCollection.intro && (
                <div className="lg:col-span-5 lg:col-start-8 pb-1 lg:pb-3">
                  <p className="text-[17px] lg:text-xl text-[#4A5568] leading-relaxed">
                    {currentCollection.intro}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
              {images.map((image, i) => {
                const isLarge = i % 3 === 0;
                const colSpan = isLarge ? "lg:col-span-8" : "lg:col-span-4";
                const aspect = isLarge ? "aspect-[4/3] lg:aspect-[16/9]" : "aspect-[3/4]";
                
                return (
                  <div key={image.id} className={`${colSpan} flex flex-col group`}>
                    <div className={`relative w-full overflow-hidden rounded-sm bg-[#F9F9F8] ${aspect}`}>
                      <Image
                        src={image.url}
                        alt={image.alt || `${currentCollection.title} ${i + 1}`}
                        fill
                        sizes={isLarge ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        style={image.focalPoint ? { objectPosition: image.focalPoint } : {}}
                        priority={i === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* CTA SECTION */}
        <div className="mt-16 lg:mt-24 border-t border-[#E2E8F0] pt-12 lg:pt-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="lg:max-w-xl text-center lg:text-left">
            <h2 className="font-display text-3xl text-[#1A1A1A] mb-4">Lassen Sie sich inspirieren</h2>
            <p className="text-[17px] text-[#4A5568] leading-relaxed">
              Unsere Kollektionen werden regelmäßig erneuert. Besuchen Sie uns im Geschäft in Hietzing, um die aktuelle Verfügbarkeit zu prüfen, die Stoffe zu fühlen und neue Lieblingsstücke zu entdecken.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              href="/outfits"
              className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
            >
              Outfits ansehen
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-sm border border-[#E2E8F0] bg-white px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F9F9F8] hover:border-[#1A1A1A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Geschäft besuchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
