import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { storeDetails, seoRoutes, siteUrl, imagery } from "@/content/fixtures/checkpot";

const seo = seoRoutes.find((r) => r.route === "/kontakt")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default function KontaktPage() {
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
      .filter((h) => h.schemaDays)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.schemaDays,
        opens: h.opens,
        closes: h.closes,
      })),
  };

  return (
    <div className="flex flex-col">
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

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="mb-16 lg:mb-24">
          <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
            Besuch & Beratung
          </span>
          <h1 className="text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            Kontakt & Öffnungszeiten
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#4A5568] sm:text-xl">
            Wir freuen uns auf Ihren Besuch in unserer Boutique oder auf Ihre Nachricht.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col lg:col-span-5 lg:col-start-1">
            <div className="rounded-md bg-[#F9F9F8] p-8 lg:p-12">
              <h2 className="mb-6 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">Besuchen Sie uns</h2>
              
              <address className="space-y-1 not-italic text-[15px] leading-relaxed text-[#4A5568]">
                <p className="font-medium text-[#1A1A1A]">{storeDetails.name}</p>
                <p>{storeDetails.address.street}</p>
                <p>{storeDetails.address.postalCode} {storeDetails.address.city}</p>
                <p>Österreich</p>
              </address>

              <div className="mt-8 space-y-3 text-[15px] text-[#4A5568]">
                <p>
                  <span className="font-medium text-[#1A1A1A]">Telefon:</span>{" "}
                  <a href={storeDetails.phoneHref} className="transition-colors hover:text-[#C01718]">{storeDetails.phone}</a>
                </p>
                <p>
                  <span className="font-medium text-[#1A1A1A]">WhatsApp:</span>{" "}
                  <a href={storeDetails.whatsappHref} className="transition-colors hover:text-[#C01718]">{storeDetails.whatsapp}</a>
                </p>
                <p>
                  <span className="font-medium text-[#1A1A1A]">E-Mail:</span>{" "}
                  <a href={storeDetails.emailHref} className="transition-colors hover:text-[#C01718]">{storeDetails.email}</a>
                </p>
              </div>

              <div className="mt-12">
                <a
                  href={storeDetails.routePlanningHref}
                  className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
                >
                  Route planen (Maps)
                </a>
              </div>
            </div>

            <div className="mt-8 rounded-md border border-[#E2E8F0] p-8 lg:p-12">
              <h2 className="mb-8 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">Öffnungszeiten</h2>
              <dl className="space-y-4 text-[15px] text-[#4A5568]">
                {storeDetails.hours.map((hour) => (
                  <div key={hour.label} className="flex justify-between border-b border-[#E2E8F0] pb-4 last:border-0 last:pb-0">
                    <dt className="font-medium text-[#1A1A1A]">{hour.label}</dt>
                    <dd>{hour.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
            <h2 className="mb-10 text-3xl font-normal tracking-tight text-[#1A1A1A]">Schreiben Sie uns</h2>
            <form className="space-y-8" action="/kontakt">
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                    Vorname
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="block w-full border-0 border-b border-[#E2E8F0] bg-transparent py-2 px-0 text-[#1A1A1A] focus:border-[#C01718] focus:ring-0 sm:text-[15px] sm:leading-6"
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                    Nachname
                  </label>
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    autoComplete="family-name"
                    className="block w-full border-0 border-b border-[#E2E8F0] bg-transparent py-2 px-0 text-[#1A1A1A] focus:border-[#C01718] focus:ring-0 sm:text-[15px] sm:leading-6"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full border-0 border-b border-[#E2E8F0] bg-transparent py-2 px-0 text-[#1A1A1A] focus:border-[#C01718] focus:ring-0 sm:text-[15px] sm:leading-6"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                    Ihre Nachricht
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full border-0 border-b border-[#E2E8F0] bg-transparent py-2 px-0 text-[#1A1A1A] focus:border-[#C01718] focus:ring-0 sm:text-[15px] sm:leading-6"
                  />
                </div>
              </div>
              <div className="pt-8">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center rounded-md bg-[#1A1A1A] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#333333] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                >
                  Nachricht senden
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
