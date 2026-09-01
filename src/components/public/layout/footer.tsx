import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import type { StoreDetails } from "@/lib/contracts/public";
import { ConsentReopenButton } from "@/components/public/consent/consent-reopen-button";

export function Footer({ storeDetails }: { storeDetails: StoreDetails }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E2DC] bg-[#F9F9F8] text-[#1A1A1A]">
      <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-10 sm:pt-14 lg:pt-18 pb-6 sm:pb-8 lg:pb-10">
        
        {/* Main Footer Grid: Brand Block (Left) + Information Columns (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] 2xl:grid-cols-[1.2fr_2fr] gap-10 lg:gap-14 xl:gap-20">
          
          {/* Brand & Editorial Identity Block */}
          <div className="flex flex-col items-start max-w-sm">
            <Link
              href="/"
              className="inline-block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              <div className="relative h-9 w-32 2xl:w-36">
                <Image
                  src="/customer/checkpot-logo.svg"
                  alt="Checkpot Boutique Wien"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="mt-4 font-display text-[18px] lg:text-[20px] font-normal leading-snug text-[#1A1A1A]">
              Besondere Mode.<br />Persönlich beraten.
            </p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#5A6578]">
              Boutique Wien-Hietzing · Seit 2009
            </p>
          </div>

          {/* Right Information Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            
            {/* 1. Direkter Kontakt */}
            <div>
              <h3 className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A] mb-3.5">
                Kontakt
              </h3>
              <ul className="flex flex-col space-y-2.5 text-[14.5px] text-[#4A5568]">
                {storeDetails.phone && (
                  <li>
                    <a
                      href={storeDetails.phoneHref}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      {storeDetails.phone}
                    </a>
                  </li>
                )}
                {storeDetails.whatsapp && (
                  <li>
                    <a
                      href={storeDetails.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      WhatsApp Nachricht ↗
                    </a>
                  </li>
                )}
                {storeDetails.email && (
                  <li>
                    <a
                      href={storeDetails.emailHref}
                      className="hover:text-[#C01718] transition-colors break-all focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      {storeDetails.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* 2 & 3. Navigation & Information: 2 columns on mobile, individual columns on sm+ */}
            <div className="grid grid-cols-2 col-span-1 sm:col-span-2 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {/* Entdecken */}
              <div>
                <h3 className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A] mb-2.5 sm:mb-3.5">
                  Entdecken
                </h3>
                <ul className="flex flex-col space-y-2 text-[14px] sm:text-[14.5px] text-[#4A5568]">
                  <li>
                    <Link
                      href={"/mode" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Mode
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/outfits" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Outfits
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/marken" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Marken
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/fair-trade" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Fair Trade
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Information & Rechtliches */}
              <div>
                <h3 className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A] mb-2.5 sm:mb-3.5">
                  Information
                </h3>
                <ul className="flex flex-col space-y-2 text-[14px] sm:text-[14.5px] text-[#4A5568]">
                  <li>
                    <Link
                      href={"/ueber-uns" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Über uns
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/kontakt" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Kontakt & Anfahrt
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/impressum" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Impressum
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/datenschutz" as Route}
                      className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                    >
                      Datenschutz
                    </Link>
                  </li>
                  <li>
                    <ConsentReopenButton className="hover:text-[#C01718] text-left transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]" />
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Meta Row */}
        <div className="mt-8 sm:mt-12 lg:mt-14 pt-4 sm:pt-6 border-t border-[#E5E2DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[#718096]">
          <p>
            &copy; {currentYear} {storeDetails.name} Hietzing
          </p>
          <p>
            1130 Wien · Hietzinger Hauptstraße 10–16
          </p>
        </div>

      </div>
    </footer>
  );
}

