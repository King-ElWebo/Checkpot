'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

export function StandardsAccordion() {
  const [activeStandard, setActiveStandard] = useState<'gots' | 'fairwear' | null>('gots');

  return (
    <div className="w-full">
      {/* ============================================================ */}
      {/* MOBILE ACCORDION (< 768px)                                   */}
      {/* ============================================================ */}
      <div className="block md:hidden flex flex-col divide-y divide-[#EDEAE4] border-y border-[#EDEAE4] bg-white rounded-sm">
        
        {/* 1. GOTS Item */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setActiveStandard(activeStandard === 'gots' ? null : 'gots')}
            aria-expanded={activeStandard === 'gots'}
            className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-[#FAF9F6] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="relative h-8 w-16 shrink-0">
                <Image
                  src="/customer/standards/gots-logo_cmyk.jpg"
                  alt="GOTS Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h3 className={`font-display text-[15.5px] leading-snug truncate transition-colors ${
                activeStandard === 'gots' ? 'text-[#C01718] font-medium' : 'text-[#1A1A1A] font-normal'
              }`}>
                Global Organic Textile Standard (GOTS)
              </h3>
            </div>
            <span
              className={`text-lg font-mono leading-none shrink-0 transition-transform duration-200 ${
                activeStandard === 'gots' ? 'text-[#C01718] rotate-45' : 'text-[#A0AEC0]'
              }`}
              aria-hidden="true"
            >
              +
            </span>
          </button>

          {activeStandard === 'gots' && (
            <div className="px-4 pb-5 pt-2 bg-[#FAF9F6]/60 border-t border-[#ECEAE4]/60 flex flex-col gap-3">
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                GOTS ist ein Standard für Textilien aus ökologisch erzeugten Naturfasern mit definierten Umwelt- und Sozialkriterien entlang der textilen Verarbeitung.
              </p>

              <div className="border-t border-[#EDEAE4] pt-2.5">
                <span className="text-[10.5px] font-mono font-medium text-[#718096] uppercase tracking-wider block mb-1">
                  Bei Checkpot relevant:
                </span>
                <p className="text-[13.5px] text-[#1A1A1A] leading-normal">
                  <span className="font-medium">Madness</span> (durchgehend zertifiziert seit 2012) sowie ausgewählte Linien von <span className="font-medium">King Louie</span>, <span className="font-medium">Seasalt</span> und <span className="font-medium">Nomads</span>.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href={"/marken/madness" as Route}
                  className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Marke Madness ansehen{" "}
                  <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 2. Fair Wear Item */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setActiveStandard(activeStandard === 'fairwear' ? null : 'fairwear')}
            aria-expanded={activeStandard === 'fairwear'}
            className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-[#FAF9F6] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="relative h-8 w-14 shrink-0">
                <Image
                  src="/customer/standards/hd_logo_fairwear.jpg"
                  alt="Fair Wear Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h3 className={`font-display text-[15.5px] leading-snug truncate transition-colors ${
                activeStandard === 'fairwear' ? 'text-[#C01718] font-medium' : 'text-[#1A1A1A] font-normal'
              }`}>
                Fair Wear Foundation
              </h3>
            </div>
            <span
              className={`text-lg font-mono leading-none shrink-0 transition-transform duration-200 ${
                activeStandard === 'fairwear' ? 'text-[#C01718] rotate-45' : 'text-[#A0AEC0]'
              }`}
              aria-hidden="true"
            >
              +
            </span>
          </button>

          {activeStandard === 'fairwear' && (
            <div className="px-4 pb-5 pt-2 bg-[#FAF9F6]/60 border-t border-[#ECEAE4]/60 flex flex-col gap-3">
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Fair Wear arbeitet mit Mitgliedsmarken an besseren Arbeitsbedingungen und menschenrechtlicher Sorgfalt in textilen Lieferketten.
              </p>

              <div className="border-t border-[#EDEAE4] pt-2.5">
                <span className="text-[10.5px] font-mono font-medium text-[#718096] uppercase tracking-wider block mb-1">
                  Bei Checkpot:
                </span>
                <p className="text-[13.5px] text-[#1A1A1A] leading-normal">
                  <span className="font-medium">Madness</span> ist aktives Mitglied der Fair Wear Foundation für überprüfte Arbeitsbedingungen in der Konfektion.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href={"/marken/madness" as Route}
                  className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Marke Madness ansehen{" "}
                  <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ============================================================ */}
      {/* DESKTOP 2-COLUMN COMPARISON (>= 768px) — STRICTLY FROZEN     */}
      {/* ============================================================ */}
      <div className="hidden md:grid grid-cols-2 gap-10 lg:gap-14 pt-2">
        
        {/* Left: GOTS */}
        <div className="flex flex-col justify-between border-t border-[#E5E2DC] pt-6">
          <div>
            <div className="relative h-12 w-32 max-w-[140px] mb-4">
              <Image
                src="/customer/standards/gots-logo_cmyk.jpg"
                alt="Global Organic Textile Standard (GOTS)"
                fill
                className="object-contain object-left"
              />
            </div>

            <h3 className="font-display text-2xl text-[#1A1A1A] mb-2.5 leading-tight">
              Global Organic Textile Standard (GOTS)
            </h3>

            <p className="text-[14.5px] leading-relaxed text-[#4A5568] mb-5">
              GOTS ist ein Standard für Textilien aus ökologisch erzeugten Naturfasern mit definierten Umwelt- und Sozialkriterien entlang der textilen Verarbeitung.
            </p>

            <div className="border-t border-[#EDEAE4] pt-3.5 mb-5">
              <span className="text-[11px] font-mono font-medium text-[#718096] uppercase tracking-wider block mb-1.5">
                Bei Checkpot relevant:
              </span>
              <p className="text-[14px] text-[#1A1A1A] leading-normal">
                <span className="font-medium">Madness</span> (durchgehend zertifiziert seit 2012) sowie ausgewählte Linien von <span className="font-medium">King Louie</span>, <span className="font-medium">Seasalt</span> und <span className="font-medium">Nomads</span>.
              </p>
            </div>
          </div>

          <div>
            <Link
              href={"/marken/madness" as Route}
              className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors hover:text-[#C01718]"
            >
              Marke Madness ansehen{" "}
              <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Right: Fair Wear */}
        <div className="flex flex-col justify-between border-t border-[#E5E2DC] pt-6">
          <div>
            <div className="relative h-12 w-28 max-w-[120px] mb-4">
              <Image
                src="/customer/standards/hd_logo_fairwear.jpg"
                alt="Fair Wear Foundation"
                fill
                className="object-contain object-left"
              />
            </div>

            <h3 className="font-display text-2xl text-[#1A1A1A] mb-2.5 leading-tight">
              Fair Wear Foundation
            </h3>

            <p className="text-[14.5px] leading-relaxed text-[#4A5568] mb-5">
              Fair Wear arbeitet mit Mitgliedsmarken an besseren Arbeitsbedingungen und menschenrechtlicher Sorgfalt in textilen Lieferketten.
            </p>

            <div className="border-t border-[#EDEAE4] pt-3.5 mb-5">
              <span className="text-[11px] font-mono font-medium text-[#718096] uppercase tracking-wider block mb-1.5">
                Bei Checkpot:
              </span>
              <p className="text-[14px] text-[#1A1A1A] leading-normal">
                <span className="font-medium">Madness</span> ist aktives Mitglied der Fair Wear Foundation für überprüfte Arbeitsbedingungen in der Konfektion.
              </p>
            </div>
          </div>

          <div>
            <Link
              href={"/marken/madness" as Route}
              className="group inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors hover:text-[#C01718]"
            >
              Marke Madness ansehen{" "}
              <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
