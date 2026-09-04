"use client";

import { useState } from "react";
import { useConsent } from "@/components/public/consent/consent-context";

interface ContactMapProps {
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  routePlanningHref: string;
}

function ConsentedMapFrame({
  embedUrl,
  routePlanningHref,
}: {
  embedUrl: string;
  routePlanningHref: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Error Fallback State
  if (hasError) {
    return (
      <div
        role="alert"
        className="w-full h-full min-h-[360px] sm:min-h-[400px] lg:min-h-[460px] bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center text-[#1A1A1A]"
      >
        <p className="text-[14px] text-[#4A5568] mb-3">
          Karte konnte nicht geladen werden.
        </p>
        <a
          href={routePlanningHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.08em] text-white hover:bg-[#C01718] transition-colors"
        >
          Route direkt öffnen ↗
        </a>
      </div>
    );
  }

  // Active Consented Map State
  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[400px] lg:min-h-[460px] bg-[#EFECE6] overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FAF9F6] text-[#4A5568] text-xs uppercase tracking-wider">
          <span className="inline-flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C01718] animate-ping" aria-hidden="true" />
            Karte wird geladen...
          </span>
        </div>
      )}
      <iframe
        src={embedUrl}
        title="Standort der Checkpot Boutique auf Google Maps"
        className="w-full h-full min-h-[360px] sm:min-h-[400px] lg:min-h-[460px] border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export function ContactMap({ address, routePlanningHref }: ContactMapProps) {
  const { consent, acceptExternalMedia } = useConsent();

  const hasConsent = Boolean(consent?.externalMedia);

  // Exact physical address query to ensure accurate pin on Hietzinger Hauptstraße 10-16
  const query = encodeURIComponent(`${address.street}, ${address.postalCode} ${address.city}`);
  const embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  // 1. Consent Gated Placeholder State (Matches panel height seamlessly)
  if (!hasConsent) {
    return (
      <div
        role="region"
        aria-label="Standortkarte Einverständniserklärung"
        className="relative w-full h-full min-h-[360px] sm:min-h-[400px] lg:min-h-[460px] bg-[#FAF9F6] flex flex-col items-center justify-center p-6 sm:p-8 text-center"
      >
        <div className="relative z-10 flex flex-col items-center max-w-xs sm:max-w-sm">
          {/* Map Pin Icon */}
          <div className="w-12 h-12 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center mb-3.5">
            <svg
              className="w-5 h-5 text-[#C01718]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-1.5">
            Interaktive Standortkarte
          </span>

          <h3 className="font-display text-xl sm:text-2xl text-[#1A1A1A] font-normal mb-2">
            Google Maps anzeigen
          </h3>

          <p className="text-[13.5px] sm:text-[14px] text-[#4A5568] leading-relaxed mb-5 max-w-xs">
            Aus Datenschutzgründen wird die interaktive Karte erst geladen, wenn Sie der Anzeige externer Medien zustimmen.
          </p>

          <button
            type="button"
            onClick={acceptExternalMedia}
            className="inline-flex cursor-pointer items-center justify-center rounded-sm bg-[#C01718] px-7 py-3 text-[12.5px] 2xl:text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] min-h-[44px]"
          >
            Karte anzeigen
          </button>

          <a
            href={routePlanningHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 text-[12.5px] text-[#4A5568] hover:text-[#C01718] border-b border-[#1A1A1A]/20 hover:border-[#C01718] pb-0.5 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
          >
            Route direkt auf Google Maps öffnen →
          </a>
        </div>
      </div>
    );
  }

  // 2. Consented Active Map
  return <ConsentedMapFrame embedUrl={embedUrl} routePlanningHref={routePlanningHref} />;
}
