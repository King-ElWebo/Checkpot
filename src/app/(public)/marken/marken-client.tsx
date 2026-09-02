'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { BrandDto } from '@/lib/repositories/brands';

interface MarkenClientProps {
  brands: BrandDto[];
}

export function MarkenDirectory({ brands }: MarkenClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="w-full">
      {/* ============================================================ */}
      {/* MOBILE & TABLET ACCORDION DIRECTORY (< 1024px)              */}
      {/* ============================================================ */}
      <div className="block lg:hidden flex flex-col divide-y divide-[#ECEAE4] border-y border-[#ECEAE4] bg-white rounded-sm">
        {brands.map((brand, idx) => {
          const isExpanded = activeIndex === idx;
          const indexNumber = String(idx + 1).padStart(2, '0');

          return (
            <div key={brand.slug} className="flex flex-col">
              {/* Accordion Row Trigger */}
              <button
                type="button"
                onClick={() => setActiveIndex(isExpanded ? null : idx)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between py-4 px-4 sm:px-5 text-left hover:bg-[#FAF9F6] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="text-[12px] font-mono font-medium text-[#718096] shrink-0">
                    {indexNumber}
                  </span>
                  <h2 className={`font-display text-[17.5px] sm:text-[19px] truncate transition-colors ${
                    isExpanded ? 'text-[#C01718] font-medium' : 'text-[#1A1A1A] font-normal'
                  }`}>
                    {brand.name}
                  </h2>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-lg font-mono leading-none transition-transform duration-200 ${
                      isExpanded ? 'text-[#C01718] rotate-45' : 'text-[#A0AEC0]'
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
              </button>

              {/* Expanded Panel */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 bg-[#FAF9F6]/60 border-t border-[#ECEAE4]/60 flex flex-col gap-3">
                  {/* Visual Area */}
                  {brand.image?.url ? (
                    <div className="relative aspect-[16/10] max-h-[250px] w-full rounded-sm overflow-hidden bg-[#FAF9F6] border border-[#E5E2DC]">
                      <Image
                        src={brand.image.url}
                        alt={brand.image.alt || brand.name}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        style={{ objectPosition: brand.image.focalPoint || 'center' }}
                      />
                    </div>
                  ) : (
                    /* Compact Mobile Typographic Fallback (approx. 120px) */
                    <div className="flex h-[120px] w-full flex-col justify-between p-3.5 bg-[#F6F4EE] rounded-sm border border-[#E5E2DC] select-none">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C01718]" aria-hidden="true" />
                          <span className="text-[10.5px] font-mono font-medium tracking-wider text-[#718096]">
                            {indexNumber}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#718096] font-semibold">
                          Bei Checkpot · Hietzing
                        </span>
                      </div>
                      <div className="text-center py-1">
                        <span className="font-display text-xl sm:text-2xl font-normal text-[#1A1A1A]">
                          {brand.name}
                        </span>
                      </div>
                      <div className="h-0.5" />
                    </div>
                  )}

                  {/* Summary (Concise line clamp on mobile) */}
                  {brand.summary && (
                    <p className="text-[14px] leading-relaxed text-[#4A5568] line-clamp-3">
                      {brand.summary}
                    </p>
                  )}

                  {/* Canonical Brand Link */}
                  <div className="pt-1">
                    <Link
                      href={`/marken/${brand.slug}` as Route}
                      className="group inline-flex items-center text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      Marke entdecken{" "}
                      <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* DESKTOP 3-COLUMN BRAND GRID (>= 1024px) — STRICTLY FROZEN    */}
      {/* ============================================================ */}
      <div className="hidden lg:grid grid-cols-3 gap-x-8 lg:gap-x-12 xl:gap-x-14 gap-y-12 sm:gap-y-16 lg:gap-y-20">
        {brands.map((brand, idx) => {
          const indexNumber = String(idx + 1).padStart(2, '0');

          return (
            <Link
              key={brand.slug}
              href={`/marken/${brand.slug}` as Route}
              className="group flex flex-col focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4 rounded-sm"
            >
              {/* Visual Area */}
              <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] xl:aspect-[4/3] rounded-sm overflow-hidden bg-[#FAF9F6] border border-[#E5E2DC] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                {brand.image?.url ? (
                  <Image
                    src={brand.image.url}
                    alt={brand.image.alt || brand.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    style={{ objectPosition: brand.image.focalPoint || 'center' }}
                  />
                ) : (
                  /* Intentional Typographic Fallback Panel */
                  <div className="flex h-full w-full flex-col justify-between p-6 sm:p-7 bg-[#F6F4EE] select-none transition-colors duration-300 group-hover:bg-[#F0EDE5]">
                    {/* Top Index */}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C01718]" aria-hidden="true" />
                      <span className="text-[11.5px] font-mono font-medium tracking-wider text-[#718096]">
                        {indexNumber}
                      </span>
                    </div>

                    {/* Center Brand Name Display */}
                    <div className="text-center px-2 py-4">
                      <span className="font-display text-2xl sm:text-3xl xl:text-[32px] font-normal leading-tight tracking-tight text-[#1A1A1A] group-hover:text-[#C01718] transition-colors block">
                        {brand.name}
                      </span>
                    </div>

                    {/* Bottom Detail */}
                    <div className="text-center border-t border-[#E5E2DC] pt-2.5">
                      <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#718096] font-medium block">
                        Bei Checkpot · Hietzing
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Identity & Content */}
              <div className="mt-5 flex flex-1 flex-col items-start">
                <h2 className="font-display text-2xl lg:text-[26px] 2xl:text-[28px] font-normal tracking-tight text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C01718]">
                  {brand.name}
                </h2>

                {brand.summary && (
                  <p className="mt-2 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#4A5568] max-w-md line-clamp-3">
                    {brand.summary}
                  </p>
                )}

                <div className="mt-4 pt-1">
                  <span className="inline-flex items-center text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] border-b border-[#1A1A1A]/30 group-hover:border-[#C01718] pb-0.5 transition-colors duration-200 group-hover:text-[#C01718]">
                    Marke entdecken{" "}
                    <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
