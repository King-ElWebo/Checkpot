'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Media = {
  url: string;
  alt: string | null;
  focalPoint: string | null;
};

type Brand = {
  id: string;
  name: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  image?: Media | null;
  logo?: Media | null;
};

interface BrandBookshelfProps {
  brands: Brand[];
}

export function BrandBookshelf({ brands }: BrandBookshelfProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  if (!brands || brands.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-[#4A5568] bg-[#F9F9F8] rounded-sm">
        Derzeit sind keine Marken verfügbar.
      </div>
    );
  }

  const activeBrand = brands[activeIndex] || brands[0];
  const mobileBrands = brands.slice(0, 5);

  return (
    <div className="w-full">
      {/* 1. DESKTOP & TABLET TWO-ZONE COMPOSITION (>= 1024px) */}
      <div className="hidden lg:grid grid-cols-[1fr_1.15fr] 2xl:grid-cols-[1fr_1.2fr] gap-10 xl:gap-14 2xl:gap-18 items-stretch">
        
        {/* LEFT COLUMN: Section Info & 15-Brand Index */}
        <div className="flex flex-col justify-between py-2">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] sm:text-[13px] 2xl:text-[14px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Stöbern in Christas Auswahl
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] 2xl:text-[46px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-4">
              Unsere Marken entdecken
            </h2>

            {/* Intro text */}
            <p className="text-[14.5px] 2xl:text-[16px] text-[#4A5568] leading-relaxed mb-8 max-w-md">
              15 ausgewählte europäische Modelabels mit Persönlichkeit, Qualität und Liebe zum Detail – von skandinavischer Lässigkeit bis hin zu zeitlosen Klassikern.
            </p>

            {/* Interactive 15-Brand Typographic Index */}
            <div
              role="tablist"
              aria-label="Markenauswahl"
              className="grid grid-cols-3 gap-x-4 gap-y-2 py-4 border-y border-[#ECEAE4]"
            >
              {brands.map((brand, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={brand.id}
                    role="tab"
                    id={`brand-tab-${brand.id}`}
                    aria-selected={isActive}
                    aria-controls="active-brand-preview"
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`group flex items-center gap-1.5 py-1.5 text-left transition-colors duration-150 rounded-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] ${
                      isActive
                        ? 'text-[#C01718] font-semibold'
                        : 'text-[#1A1A1A] hover:text-[#C01718] font-normal'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity duration-150 ${
                        isActive ? 'bg-[#C01718] opacity-100' : 'bg-transparent opacity-0 group-hover:bg-[#C01718]/40 group-hover:opacity-100'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[13.5px] 2xl:text-[15px] truncate leading-tight">
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Link */}
          <div className="pt-8">
            <Link
              href="/marken"
              className="group inline-flex items-center text-[13px] 2xl:text-[14px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5"
            >
              Alle 15 Marken ansehen <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Single Large Active Brand Preview */}
        <div className="relative min-h-[480px] 2xl:min-h-[520px] flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrand.id}
              id="active-brand-preview"
              role="tabpanel"
              aria-labelledby={`brand-tab-${activeBrand.id}`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 2xl:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
            >
              {/* Preview Image or Intentional Fallback */}
              <div className="relative w-full aspect-[16/10] 2xl:aspect-[16/9.5] rounded-sm overflow-hidden bg-[#EFECE6] mb-6 select-none">
                {activeBrand.image?.url ? (
                  <Image
                    src={activeBrand.image.url}
                    alt={activeBrand.image.alt || activeBrand.name}
                    fill
                    priority={activeIndex === 0}
                    sizes="(min-width: 1536px) 50vw, (min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    style={activeBrand.image.focalPoint ? { objectPosition: activeBrand.image.focalPoint } : {}}
                  />
                ) : (
                  /* Intentional Typographic Fallback */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#EFECE6]">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#718096] mb-3">
                      Bei Checkpot in Hietzing
                    </span>
                    <span className="font-display text-4xl sm:text-5xl lg:text-[52px] text-[#1A1A1A] font-normal tracking-tight">
                      {activeBrand.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Active Brand Metadata */}
              <div className="flex flex-col items-start">
                <div className="flex items-center justify-between w-full mb-2">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#1A1A1A] font-medium">
                    {activeBrand.name}
                  </h3>
                  <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C01718]">
                    Kollektion
                  </span>
                </div>

                <p className="text-[14px] sm:text-[15px] text-[#4A5568] leading-relaxed line-clamp-2 mb-5">
                  {activeBrand.summary ||
                    activeBrand.description ||
                    'Entdecken Sie die facettenreiche Kollektion in unserer Boutique in Wien-Hietzing.'}
                </p>

                <Link
                  href={`/marken/${activeBrand.slug}`}
                  className="group inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718] hover:text-[#A01314] transition-colors border-b border-[#C01718]/40 hover:border-[#A01314] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  Marke entdecken <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 2. MOBILE & TABLET COMPACT ACCORDION (< 1024px) */}
      <div className="block lg:hidden">
        {/* Mobile Section Header */}
        <div className="mb-5 sm:mb-8 text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
              Stöbern in Christas Auswahl
            </span>
          </div>
          <h2 className="font-display text-3xl font-normal tracking-tight text-[#1A1A1A] mb-3">
            Unsere Marken entdecken
          </h2>
          <p className="text-[14px] text-[#4A5568] leading-relaxed">
            15 ausgewählte europäische Modelabels mit Persönlichkeit und Qualität.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col divide-y divide-[#ECEAE4] border-y border-[#ECEAE4] bg-white rounded-sm overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          {mobileBrands.map((brand, index) => {
            const isExpanded = mobileExpandedIndex === index;

            return (
              <div key={brand.id} className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setMobileExpandedIndex(isExpanded ? null : index)}
                  className="flex items-center justify-between p-3.5 sm:p-4 text-left transition-colors hover:bg-[#FAF9F6] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                >
                  <span className={`text-[15px] ${isExpanded ? 'font-semibold text-[#C01718]' : 'font-medium text-[#1A1A1A]'}`}>
                    {brand.name}
                  </span>
                  <span className={`text-lg transition-transform duration-200 ${isExpanded ? 'text-[#C01718] rotate-45' : 'text-[#718096]'}`} aria-hidden="true">
                    +
                  </span>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden bg-[#FAF9F6] px-3.5 sm:px-4 pb-4 sm:pb-6 pt-2 flex flex-col gap-3 sm:gap-4 border-t border-[#ECEAE4]/60"
                    >
                      {/* Image / Fallback */}
                      <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden bg-[#EFECE6]">
                        {brand.image?.url ? (
                          <Image
                            src={brand.image.url}
                            alt={brand.image.alt || brand.name}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            style={brand.image.focalPoint ? { objectPosition: brand.image.focalPoint } : {}}
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#EFECE6]">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718096] mb-1.5">
                              Bei Checkpot in Hietzing
                            </span>
                            <span className="font-display text-2xl text-[#1A1A1A] font-normal">
                              {brand.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="text-[13.5px] text-[#4A5568] leading-relaxed">
                        {brand.summary || brand.description || 'Entdecken Sie die aktuelle Kollektion in unserer Boutique.'}
                      </p>

                      {/* Link */}
                      <Link
                        href={`/marken/${brand.slug}`}
                        className="inline-flex items-center text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#C01718] hover:underline self-start"
                      >
                        Marke entdecken <span className="ml-1" aria-hidden="true">→</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Mobile Bottom Link */}
        <div className="mt-5 sm:mt-6 text-center">
          <Link
            href="/marken"
            className="inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/30 pb-0.5"
          >
            Alle 15 Marken ansehen <span className="ml-1.5" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
