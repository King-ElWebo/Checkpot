import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes, imagery } from "@/content/fixtures/checkpot";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { getSiteUrl } from "@/lib/site-config";
import { ContactForm } from "./contact-form";

const seo = seoRoutes.find((r) => r.route === "/kontakt")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default async function KontaktPage() {
  const storeDetails = await getStoreDetails();
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeDetails.name,
    image: new URL(imagery.hero.src, siteUrl).toString(),
    telephone: storeDetails.phone,
    email: storeDetails.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeDetails.address.street,
      postalCode: storeDetails.address.postalCode,
      addressLocality: storeDetails.address.city,
      addressCountry: storeDetails.address.country,
    },
    openingHoursSpecification: storeDetails.hours
      .filter((h) => h.schemaDays && h.schemaDays.length > 0)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.schemaDays,
        opens: h.opens,
        closes: h.closes,
      })),
  };


  return (
    <div className="flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Kontakt", href: "/kontakt" },
          ]}
        />
      </div>

      {/* 1. CONTACT OPENING (Practical info first) */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        
        <div className="mb-12 lg:mb-20">
          <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-6">
            Besuchen Sie uns
          </h1>
          <p className="text-xl text-[#4A5568] max-w-2xl leading-relaxed">
            Wir freuen uns darauf, Sie persönlich in unserer Boutique in Hietzing zu beraten.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <div className="lg:col-span-5 lg:col-start-1">
            <div className="bg-[#F9F9F8] p-8 lg:p-12 rounded-sm mb-8">
              <h2 className="font-display text-2xl text-[#1A1A1A] mb-6">{storeDetails.name}</h2>
              
              <address className="not-italic text-[17px] text-[#4A5568] leading-relaxed mb-10">
                {storeDetails.address.street}<br />
                {storeDetails.address.postalCode} {storeDetails.address.city}<br />
                Österreich
              </address>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] mb-3">Öffnungszeiten</h3>
                  <dl className="space-y-2 text-[15px] text-[#4A5568]">
                    {storeDetails.hours.map((hour) => (
                      <div key={hour.label} className="flex justify-between">
                        <dt>{hour.label}</dt>
                        <dd className="font-medium text-[#1A1A1A]">{hour.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {storeDetails.hoursNote && (
                    <p className="mt-3 text-[13px] text-[#718096] italic">
                      {storeDetails.hoursNote}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-[#E2E8F0]">
                  <h3 className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] mb-3">Direkter Kontakt</h3>
                  <div className="space-y-3 text-[15px]">
                    <a href={storeDetails.phoneHref} className="flex items-center text-[#4A5568] hover:text-[#C01718] transition-colors">
                      <span className="w-24">Telefon:</span>
                      <span className="font-medium text-[#1A1A1A]">{storeDetails.phone}</span>
                    </a>
                    <a href={storeDetails.emailHref} className="flex items-center text-[#4A5568] hover:text-[#C01718] transition-colors">
                      <span className="w-24">E-Mail:</span>
                      <span className="font-medium text-[#1A1A1A]">{storeDetails.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ACTIONS: WhatsApp & Route */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={storeDetails.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#C01718] px-6 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Auf WhatsApp schreiben
              </a>
              <a
                href={storeDetails.routePlanningHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-6 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#333333] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                Route planen
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="relative aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#E2E8F0]">
              <Image
                src={imagery.sustainabilityShelf.src}
                alt={imagery.sustainabilityShelf.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.sustainabilityShelf.objectPosition }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM */}
      <section className="bg-[#F9F9F8] border-y border-[#E2E8F0] px-4 py-20 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl text-[#1A1A1A] mb-6">Nachricht senden</h2>
              <p className="text-[17px] text-[#4A5568] leading-relaxed mb-8">
                Haben Sie eine Frage zu unserer Kollektion oder möchten Sie wissen, ob ein bestimmtes Stück vorrätig ist? Schreiben Sie uns einfach eine Nachricht.
              </p>
              
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#E2E8F0] mt-12 hidden lg:block">
                <Image
                  src={imagery.storeDetails[0].src}
                  alt={imagery.storeDetails[0].alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: imagery.storeDetails[0].objectPosition }}
                />
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 bg-white p-8 lg:p-12 rounded-sm border border-[#E2E8F0]">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
