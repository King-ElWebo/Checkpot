import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { StoreDetails } from "@/lib/contracts/public";

interface ComingSoonProps {
  storeDetails: StoreDetails;
}

export function ComingSoon({ storeDetails }: ComingSoonProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Top Quiet Brand Header */}
      <header className="border-b border-[#ECEAE4] bg-white/80 backdrop-blur-xs py-4 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link
            href={"/" as Route}
            className="flex items-center gap-2.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
            aria-label="Checkpot Startseite"
          >
            <span className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A]">
              Checkpot
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C01718]" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-[#718096] hidden sm:inline-block">
              Hietzing
            </span>
          </Link>

          <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] bg-[#FDF2F2] border border-[#FCDAD9] px-3 py-1 rounded-full">
            In Vorbereitung
          </span>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 flex items-center py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
            
            {/* Left Content Column */}
            <div className="flex flex-col">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
                <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                  Checkpot · Wien-Hietzing
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] 2xl:text-[56px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-4 sm:mb-5">
                Wir sind bald für Sie da.
              </h1>

              {/* Copy */}
              <p className="text-[15.5px] sm:text-[17.5px] leading-relaxed text-[#4A5568] max-w-xl mb-8">
                Unsere Boutique in Wien-Hietzing ist natürlich weiterhin persönlich für Sie da. 
                Die neue Checkpot Website wird gerade sorgfältig für Sie vorbereitet.
              </p>

              {/* Centralized Store Contact & Hours Card */}
              <div className="bg-white border border-[#ECEAE4] rounded-sm p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] max-w-xl">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#718096] font-semibold mb-3.5 block">
                  Persönlich vor Ort in Hietzing
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Address */}
                  <div>
                    <h2 className="text-sm font-bold text-[#1A1A1A] mb-1.5">
                      {storeDetails.name}
                    </h2>
                    <address className="not-italic text-[14px] text-[#4A5568] leading-relaxed">
                      {storeDetails.address.street}
                      <br />
                      {storeDetails.address.postalCode} {storeDetails.address.city}
                      <br />
                      <span className="text-xs text-[#718096]">Österreich</span>
                    </address>
                  </div>

                  {/* Hours */}
                  <div>
                    <h2 className="text-sm font-bold text-[#1A1A1A] mb-1.5">
                      Öffnungszeiten
                    </h2>
                    <div className="text-[13.5px] text-[#4A5568] space-y-1">
                      {storeDetails.hours.map((h) => (
                        <div key={h.label} className="flex justify-between gap-3">
                          <span className="text-[#718096]">{h.label}:</span>
                          <span className="font-medium text-[#1A1A1A]">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Contact Bar */}
                <div className="mt-6 pt-5 border-t border-[#ECEAE4] flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
                  {storeDetails.phone && (
                    <a
                      href={`tel:${storeDetails.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1.5 font-medium text-[#1A1A1A] hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
                    >
                      <span className="text-xs text-[#718096]">Tel:</span> {storeDetails.phone}
                    </a>
                  )}
                  {storeDetails.email && (
                    <a
                      href={`mailto:${storeDetails.email}`}
                      className="inline-flex items-center gap-1.5 text-[#4A5568] hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
                    >
                      <span className="text-xs text-[#718096]">E-Mail:</span> {storeDetails.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[460px] lg:max-h-[580px] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
              <Image
                src="/customer/christa-storefront.jpg"
                alt="Checkpot Boutique in Wien-Hietzing Außenansicht"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>

          </div>
        </div>
      </main>

      {/* Quiet Legal Footer */}
      <footer className="border-t border-[#ECEAE4] py-6 px-6 sm:px-8 lg:px-12 bg-white text-xs text-[#718096]">
        <div className="mx-auto flex max-w-[1400px] flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} Checkpot Hietzing Boutique · Christa Hausmair</p>
          <div className="flex items-center gap-5">
            <Link
              href={"/impressum" as Route}
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
            >
              Impressum
            </Link>
            <span aria-hidden="true" className="text-[#D5D2CA]">·</span>
            <Link
              href={"/datenschutz" as Route}
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
