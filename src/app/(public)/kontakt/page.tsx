import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      
      {/* QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1360px] px-6 lg:px-8 2xl:px-12 pt-6 pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Kontakt", href: "/kontakt" },
          ]}
        />
      </div>

      {/* CHAPTER 1: STORE / LOCATION (DOMINANT STOREFRONT OPENING) */}
      <section className="mx-auto w-full max-w-[1360px] px-6 lg:px-8 2xl:px-12 pt-2 pb-12 lg:pb-16">
        <FadeIn duration={600} translateY={16}>
          {/* Header Typography */}
          <div className="max-w-2xl mb-5">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Boutique in Wien-Hietzing
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-3">
              Besuchen Sie uns.
            </h1>

            <p className="text-[16.5px] sm:text-[18px] text-[#4A5568] leading-relaxed">
              Persönliche Beratung, besondere Mode und Zeit zum Ausprobieren – direkt in Hietzing.
            </p>
          </div>

          {/* Address Line & Direct Route Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 mb-6 border-b border-[#EDEAE4] pb-4">
            <span className="text-[12px] font-mono font-medium tracking-[0.12em] text-[#718096] uppercase">
              Hietzinger Hauptstraße 10–16 · 1130 Wien
            </span>
            <a
              href={storeDetails.routePlanningHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 self-start sm:self-auto focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              Route planen <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </div>

          {/* Large Architectural Storefront Photo */}
          <div className="relative aspect-[16/9] sm:aspect-[21/10] lg:aspect-[21/9] max-h-[460px] 2xl:max-h-[500px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC]">
            <Image
              src="/customer/store/20260825_125300.jpg"
              alt="Geschäftseingang und Schaufenster der Checkpot Boutique in Wien-Hietzing"
              fill
              priority
              sizes="(min-width: 1280px) 1360px, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 25%" }}
            />
          </div>
        </FadeIn>
      </section>

      {/* CHAPTER 2: SERVICE INFORMATION (COMPACT HORIZONTAL SERVICE BAR) */}
      <section className="bg-[#FAF9F6] border-y border-[#EDEAE4] py-10 lg:py-12 px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Column 1: ADRESSE */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#718096] mb-2.5">
                Adresse
              </span>
              <p className="text-[15.5px] font-medium text-[#1A1A1A] leading-snug">
                {storeDetails.name}
              </p>
              <address className="not-italic text-[14.5px] text-[#4A5568] leading-relaxed mt-1 mb-3">
                {storeDetails.address.street}
                <br />
                {storeDetails.address.postalCode} {storeDetails.address.city}
              </address>
              <div>
                <a
                  href={storeDetails.routePlanningHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Route planen <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            {/* Column 2: ÖFFNUNGSZEITEN */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#718096] mb-2.5">
                Öffnungszeiten
              </span>
              <div className="space-y-1.5 text-[14.5px] text-[#4A5568] mb-2">
                {storeDetails.hours.map((hour) => (
                  <div key={hour.label} className="flex items-baseline justify-between max-w-[220px]">
                    <span className="text-[#718096]">{hour.label}</span>
                    <span className="font-medium text-[#1A1A1A]">{hour.value}</span>
                  </div>
                ))}
              </div>
              {storeDetails.hoursNote && (
                <p className="text-[12.5px] text-[#718096] italic">
                  {storeDetails.hoursNote}
                </p>
              )}
            </div>

            {/* Column 3: DIREKT ERREICHBAR */}
            <div className="flex flex-col border-t border-[#E5E2DC] pt-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#718096] mb-2.5">
                Direkt erreichbar
              </span>
              <div className="space-y-2 text-[14.5px]">
                <div>
                  <a
                    href={storeDetails.phoneHref}
                    className="font-medium text-[#1A1A1A] hover:text-[#C01718] transition-colors"
                  >
                    {storeDetails.phone}
                  </a>
                </div>

                <div>
                  <a
                    href={storeDetails.emailHref}
                    className="font-medium text-[#1A1A1A] hover:text-[#C01718] transition-colors"
                  >
                    {storeDetails.email}
                  </a>
                </div>

                {storeDetails.whatsappHref && (
                  <div className="pt-1.5">
                    <a
                      href={storeDetails.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      WhatsApp schreiben <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CHAPTER 3: MESSAGE FORM (TYPOGRAPHY-LED FORM SECTION) */}
      <section className="py-14 lg:py-20 px-6 lg:px-8 2xl:px-12 bg-white">
        <div className="mx-auto max-w-[1360px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start">
            
            {/* Left: Editorial Intro (32-35%) */}
            <div className="lg:col-span-4 flex flex-col items-start pt-1">
              <span className="text-[11.5px] font-mono font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2">
                Noch eine Frage?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight mb-3">
                Schreiben Sie uns einfach.
              </h2>
              <p className="text-[15px] sm:text-[15.5px] text-[#4A5568] leading-relaxed max-w-sm">
                Sie möchten wissen, ob ein bestimmtes Stück verfügbar ist, haben eine Frage zu Größen oder möchten vor Ihrem Besuch etwas klären? Schreiben Sie uns gerne.
              </p>
            </div>

            {/* Right: Clean Editorial Contact Form (65-68%) */}
            <div className="lg:col-span-8 max-w-[680px] w-full">
              <ContactForm />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
