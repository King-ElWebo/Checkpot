"use client";

import Link from "next/link";
import { useConsent } from "./consent-context";

export function ConsentBanner() {
  const { isBannerOpen, consent, acceptAll, acceptNecessaryOnly, openSettings } = useConsent();

  if (consent !== null || !isBannerOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Datenschutzeinstellungen"
      className="fixed bottom-0 inset-x-0 sm:bottom-6 sm:right-6 sm:inset-x-auto z-50 w-full sm:max-w-[440px] px-4 sm:px-0 pointer-events-auto"
    >
      <div className="bg-white border border-[#E5E2DC] rounded-t-lg sm:rounded-sm p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
            <h2 className="font-display text-lg font-medium text-[#1A1A1A]">
              Ihre Privatsphäre
            </h2>
          </div>
          <p className="text-[13px] leading-relaxed text-[#4A5568]">
            Wir verwenden technisch notwendige Funktionen für den Betrieb dieser Website. Mit Ihrer
            Zustimmung verwenden wir außerdem Google Analytics, um zu verstehen, wie unsere Website
            genutzt wird und sie zu verbessern. Mehr erfahren Sie in unserer{" "}
            <Link
              href="/datenschutz"
              className="text-[#C01718] underline underline-offset-2 hover:text-[#A01314] focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#C01718] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] !text-white text-white transition-colors duration-150 hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              Alle akzeptieren
            </button>
            <button
              type="button"
              onClick={acceptNecessaryOnly}
              className="flex-1 inline-flex items-center justify-center rounded-sm bg-white border border-[#D5D2CA] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors duration-150 hover:bg-[#F9F9F8] hover:border-[#BDB9B0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              Nur notwendige
            </button>
          </div>

          <button
            type="button"
            onClick={openSettings}
            className="self-center text-[12px] font-medium text-[#718096] hover:text-[#C01718] transition-colors underline underline-offset-4 pt-1 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
          >
            Einstellungen anpassen
          </button>
        </div>
      </div>
    </aside>
  );
}
