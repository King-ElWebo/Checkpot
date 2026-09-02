import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes, imagery } from "@/content/fixtures/checkpot";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { getSiteUrl } from "@/lib/site-config";
import { ContactForm } from "./contact-form";
import { ContactMap } from "./contact-map";

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
    <div className="flex flex-col bg-[#F9F9F8] min-h-[85vh]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. QUIET BREADCRUMBS */}
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Kontakt", href: "/kontakt" },
          ]}
        />
      </div>

      {/* ============================================================ */}
      {/* CHAPTER 1: PRIMARY CONTACT (ASPEC/EDITORIAL BOUTIQUE HERO)   */}
      {/* ============================================================ */}
      <section className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-2 sm:pt-4 lg:pt-8 pb-14 sm:pb-18 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start">
          
          {/* Left Column: Heading, Warm Boutique Intro & Direct Contact Info */}
          <div className="lg:col-span-5 flex flex-col pt-0.5">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[13px] 2xl:text-[14px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Persönlich für Sie da
              </span>
            </div>

            {/* Confident Headline with Red Accent */}
            <h1 className="mb-6 font-display text-[36px] sm:text-[48px] lg:text-[58px] xl:text-[66px] 2xl:text-[74px] font-normal leading-[1.06] tracking-tight text-[#1A1A1A]">
              <span>Wir sind persönlich</span>
              <br />
              <span className="text-[#C01718] block mt-1">für Sie da.</span>
            </h1>

            {/* Warm, Boutique-Led Description */}
            <p className="mb-8 lg:mb-12 max-w-[480px] text-lg sm:text-xl leading-relaxed text-[#4A5568]">
              Ob eine Frage zu einem bestimmten Stück, zur passenden Größe oder zu Ihrem nächsten Besuch bei uns – schreiben Sie uns gerne direkt.
            </p>

            {/* Direct Contact (Pure typography with generous whitespace, zero card boxes) */}
            <div className="flex flex-col space-y-7 max-w-[440px]">
              {/* Telefon */}
              <div>
                <span className="block text-[11px] 2xl:text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#718096] mb-1.5">
                  Telefon
                </span>
                <a
                  href={storeDetails.phoneHref}
                  className="font-display text-2xl sm:text-[26px] 2xl:text-[28px] font-normal text-[#1A1A1A] hover:text-[#C01718] transition-colors"
                >
                  {storeDetails.phone}
                </a>
              </div>

              {/* E-Mail */}
              <div>
                <span className="block text-[11px] 2xl:text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#718096] mb-1.5">
                  E-Mail
                </span>
                <a
                  href={storeDetails.emailHref}
                  className="text-base sm:text-lg text-[#1A1A1A] hover:text-[#C01718] transition-colors break-all"
                >
                  {storeDetails.email}
                </a>
              </div>

              {/* WhatsApp Link */}
              {storeDetails.whatsappHref && (
                <div className="pt-2">
                  <a
                    href={storeDetails.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#25D366] mr-2.5" aria-hidden="true" />
                    <span>WhatsApp schreiben</span>
                    <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Seamlessly Integrated Contact Form */}
          <div className="lg:col-span-7 w-full pt-2 lg:pt-3">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* CHAPTER 2: BESUCHEN SIE UNS + GOOGLE MAP (WARM LIGHT BOUTIQUE) */}
      {/* ============================================================ */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-18 items-stretch">
            
            {/* Left Column: Boutique Information & Route Action */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                  <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
                  <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                    Boutique in Wien-Hietzing
                  </span>
                </div>

                {/* Heading */}
                <h2 className="mb-3 sm:mb-4 font-display text-2xl sm:text-4xl lg:text-[40px] 2xl:text-[44px] font-normal leading-[1.12] text-[#1A1A1A] tracking-tight">
                  Besuchen Sie uns.
                </h2>

                {/* Subtitle */}
                <p className="text-[15px] sm:text-[16.5px] text-[#4A5568] leading-relaxed mb-6 sm:mb-8 max-w-[440px]">
                  Persönliche Beratung, besondere Mode und Zeit zum Ausprobieren – direkt in Alt-Hietzing.
                </p>

                {/* Information: Address & Opening Hours */}
                <div className="space-y-6 sm:space-y-7">
                  {/* Adresse */}
                  <div>
                    <h3 className="mb-1 text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#718096]">
                      Adresse
                    </h3>
                    <p className="text-[16px] sm:text-[17px] font-medium text-[#1A1A1A]">
                      {storeDetails.name}
                    </p>
                    <address className="not-italic text-[15px] sm:text-[15.5px] text-[#4A5568] leading-relaxed mt-0.5">
                      {storeDetails.address.street}
                      <br />
                      {storeDetails.address.postalCode} {storeDetails.address.city}
                    </address>
                  </div>

                  {/* Öffnungszeiten */}
                  <div>
                    <h3 className="mb-1.5 text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#718096]">
                      Öffnungszeiten
                    </h3>
                    <div className="space-y-1.5 text-[14.5px] sm:text-[15.5px] text-[#1A1A1A]">
                      {storeDetails.hours.map((hour) => (
                        <div key={hour.label} className="flex items-baseline gap-4 max-w-[340px]">
                          <span className="text-[#718096] min-w-[120px] text-[13.5px] sm:text-[14px]">{hour.label}</span>
                          <span className="font-medium text-[#1A1A1A]">{hour.value}</span>
                        </div>
                      ))}
                    </div>
                    {storeDetails.hoursNote && (
                      <p className="mt-2 text-[12.5px] text-[#718096] italic">
                        {storeDetails.hoursNote}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Route Action */}
              <div className="pt-6 sm:pt-8 mt-2">
                <a
                  href={storeDetails.routePlanningHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/35 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Route planen <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            {/* Right Column: Google Map seamlessly framed like Homepage Photography */}
            <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[360px] sm:min-h-[400px] lg:min-h-[460px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC]">
              <ContactMap
                address={storeDetails.address}
                routePlanningHref={storeDetails.routePlanningHref}
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
