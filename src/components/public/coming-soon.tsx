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
      {/* Minimal Header */}
      <header className="border-b border-[#E8E5DF] bg-[#FAF9F6]/95 backdrop-blur-xs py-4 px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between">
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

          <span className="text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C01718] bg-[#FDF2F2] border border-[#FCDAD9] px-3.5 py-1 rounded-full">
            Neue Website in Vorbereitung
          </span>
        </div>
      </header>

      {/* Main Full-Viewport Editorial Split */}
      <main className="flex-1 flex items-center py-10 sm:py-14 lg:py-16 xl:py-20 px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-[1520px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 items-center">
            
            {/* Left Content Column (~48% / 6 cols on desktop) */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <span className="w-6 h-[2px] bg-[#C01718]" aria-hidden="true" />
                <span className="text-[11.5px] sm:text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[#C01718]">
                  Checkpot · Wien-Hietzing
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[42px] xl:text-[50px] 2xl:text-[56px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-5 sm:mb-6">
                Unsere neue Website<br className="hidden sm:inline" /> ist bald für Sie da.
              </h1>

              {/* Supporting Copy */}
              <p className="text-[16px] sm:text-[17.5px] xl:text-[18.5px] leading-relaxed text-[#4A5568] max-w-xl mb-8 sm:mb-10">
                Während wir unserer Website den letzten Schliff geben, ist unsere Boutique in Hietzing wie gewohnt persönlich für Sie da.
              </p>

              {/* Editorial Store Information — Integrated typographically, NO generic card box */}
              <div className="border-t border-[#E8E5DF] pt-7 sm:pt-8 max-w-xl">
                <span className="text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#718096] mb-5 block">
                  Besuchen Sie uns in Hietzing
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 mb-6">
                  {/* Address */}
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                      {storeDetails.name}
                    </h2>
                    <address className="not-italic text-[14.5px] sm:text-[15px] text-[#4A5568] leading-relaxed">
                      {storeDetails.address.street}
                      <br />
                      {storeDetails.address.postalCode} {storeDetails.address.city}
                      <br />
                      <span className="text-xs text-[#718096]">Wien · Österreich</span>
                    </address>
                  </div>

                  {/* Hours */}
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                      Öffnungszeiten
                    </h2>
                    <div className="text-[14px] sm:text-[14.5px] text-[#4A5568] space-y-1.5">
                      {storeDetails.hours.map((h) => (
                        <div key={h.label} className="flex justify-between gap-4">
                          <span className="text-[#718096]">{h.label}:</span>
                          <span className="font-medium text-[#1A1A1A]">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Contact Bar */}
                {(storeDetails.phone || storeDetails.email) && (
                  <div className="pt-5 border-t border-[#EFECE6] flex flex-wrap items-center gap-x-8 gap-y-2.5 text-[14px] sm:text-[14.5px]">
                    {storeDetails.phone && (
                      <a
                        href={`tel:${storeDetails.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-2 font-medium text-[#1A1A1A] hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
                      >
                        <span className="text-xs uppercase tracking-wider text-[#718096]">Telefon:</span>
                        <span>{storeDetails.phone}</span>
                      </a>
                    )}
                    {storeDetails.email && (
                      <a
                        href={`mailto:${storeDetails.email}`}
                        className="inline-flex items-center gap-2 text-[#4A5568] hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
                      >
                        <span className="text-xs uppercase tracking-wider text-[#718096]">E-Mail:</span>
                        <span>{storeDetails.email}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Visual Column (~52% / 6 cols on desktop) */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[3/4] xl:aspect-[4/5] min-h-[340px] sm:min-h-[440px] lg:min-h-[580px] xl:min-h-[640px] rounded-xs overflow-hidden bg-[#EFECE6] border border-[#E5E2DC]">
                <Image
                  src="/customer/christa-boutique-portrait.jpg"
                  alt="Christa Hausmair in der Checkpot Boutique in Wien-Hietzing"
                  fill
                  priority
                  sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 15%" }}
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Connected Quiet Footer */}
      <footer className="border-t border-[#E8E5DF] py-6 px-6 sm:px-8 lg:px-12 xl:px-16 bg-[#FAF9F6] text-xs text-[#718096]">
        <div className="mx-auto flex max-w-[1520px] flex-col sm:flex-row items-center justify-between gap-3">
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
