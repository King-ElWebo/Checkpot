'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type CategoryDto = { id: string; slug: string; name: string; groupId: string; groupSlug: string };
type BrandDto = { id: string; name: string; slug: string };
type MediaDto = {
  url: string;
  alt?: string | null;
  focalPoint?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
} | null;

type OutfitDto = {
  id: string;
  title: string;
  note: string | null;
  availabilityNote: string | null;
  media: MediaDto;
  brands: BrandDto[];
  categories: CategoryDto[];
};

type TaxonomyGroup = {
  id: string;
  name: string;
  slug: string;
  categories: { id: string; name: string; slug: string }[];
};

export function OutfitsLookbook({
  initialOutfits,
  taxonomy,
}: {
  initialOutfits: OutfitDto[];
  taxonomy: TaxonomyGroup[];
}) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const shouldReduceMotion = useReducedMotion();

  const handleFilterChange = (groupId: string, categoryId: string) => {
    setVisibleCount(12); // Reset mobile pagination when filters change
    setSelectedFilters((prev) => {
      const groupFilters = prev[groupId] || [];
      if (groupFilters.includes(categoryId)) {
        const updated = groupFilters.filter((id) => id !== categoryId);
        if (updated.length === 0) {
          const next = { ...prev };
          delete next[groupId];
          return next;
        }
        return { ...prev, [groupId]: updated };
      } else {
        return { ...prev, [groupId]: [...groupFilters, categoryId] };
      }
    });
  };

  const removeSingleFilter = (groupId: string, categoryId: string) => {
    handleFilterChange(groupId, categoryId);
  };

  const clearFilters = () => {
    setVisibleCount(12);
    setSelectedFilters({});
  };

  const filteredOutfits = useMemo(() => {
    return initialOutfits.filter((outfit) => {
      for (const [groupId, selectedCatIds] of Object.entries(selectedFilters)) {
        if (!selectedCatIds || selectedCatIds.length === 0) continue;

        const outfitCatsInGroup = outfit.categories.filter((c) => c.groupId === groupId);
        const matchesGroup = outfitCatsInGroup.some((c) => selectedCatIds.includes(c.id));

        if (!matchesGroup) return false;
      }
      return true;
    });
  }, [initialOutfits, selectedFilters]);

  const activeFilterEntries = useMemo(() => {
    const entries: { groupId: string; categoryId: string; groupName: string; categoryName: string }[] = [];
    for (const [groupId, catIds] of Object.entries(selectedFilters)) {
      const group = taxonomy.find((g) => g.id === groupId);
      if (!group) continue;
      for (const catId of catIds) {
        const cat = group.categories.find((c) => c.id === catId);
        if (cat) {
          entries.push({
            groupId,
            categoryId: catId,
            groupName: group.name,
            categoryName: cat.name,
          });
        }
      }
    }
    return entries;
  }, [selectedFilters, taxonomy]);

  const activeFilterCount = activeFilterEntries.length;

  return (
    <div className="w-full">
      
      {/* 1. EDITORIAL LOOKBOOK INTRO */}
      <section className="pt-2 sm:pt-4 pb-6 sm:pb-8 lg:pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-8 pb-5 sm:pb-6 border-b border-[#EDEAE4]">
          
          {/* Left: Heading & Subline */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-5 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
                Lookbook aus Hietzing
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[48px] 2xl:text-[56px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A] mb-2 sm:mb-3">
              Looks zum Entdecken.
            </h1>

            <p className="text-[15px] sm:text-[17px] text-[#4A5568] leading-relaxed">
              Kombinationen aus unserer Boutique in Hietzing – als Inspiration für Ihren eigenen Stil.
            </p>
          </div>

          {/* Right: Results Count & Filter Trigger */}
          <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 shrink-0 w-full md:w-auto pt-2 md:pt-0">
            <span className="text-[12px] sm:text-[12.5px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#718096]">
              {filteredOutfits.length} {filteredOutfits.length === 1 ? 'Look' : 'Looks'}
            </span>

            <button
              type="button"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              aria-expanded={filterPanelOpen}
              className="inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] 2xl:text-[13.5px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors py-2 px-3.5 rounded-sm border border-[#E5E2DC] hover:border-[#C01718] bg-white cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              <span>{filterPanelOpen ? 'Filter schließen' : 'Filter'}</span>
              <span className="text-base font-normal leading-none" aria-hidden="true">
                {filterPanelOpen ? '×' : '+'}
              </span>
              {activeFilterCount > 0 && !filterPanelOpen && (
                <span className="ml-1 w-5 h-5 rounded-full bg-[#C01718] text-white text-[11px] font-semibold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* 2. EXPANDABLE FILTER PANEL */}
        <AnimatePresence>
          {filterPanelOpen && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-[#FAF9F6] border-b border-[#EDEAE4] py-6 sm:py-8 px-4 sm:px-8 lg:px-10 rounded-sm mt-4 sm:mt-6">
                <div className="flex items-center justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-[#EDEAE4]">
                  <h2 className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
                    Filteroptionen
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-[12px] sm:text-[12.5px] font-medium text-[#C01718] hover:text-[#8B1E1F] transition-colors underline cursor-pointer"
                    >
                      Alle Filter zurücksetzen
                    </button>
                  )}
                </div>

                {/* Mobile Filter Presentation (< 768px): Compact Selectable Chips / Pills */}
                <div className="block md:hidden space-y-4">
                  {taxonomy.map((group) => (
                    <div key={group.id} className="flex flex-col">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718096] mb-2">
                        {group.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.categories.map((cat) => {
                          const isSelected = (selectedFilters[group.id] || []).includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleFilterChange(group.id, cat.id)}
                              aria-pressed={isSelected}
                              className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] transition-colors cursor-pointer border ${
                                isSelected
                                  ? 'bg-[#C01718] text-white border-[#C01718] font-medium'
                                  : 'bg-white text-[#4A5568] border-[#D5D2CA] hover:border-[#1A1A1A]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span>{cat.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop & Tablet Filter Presentation (>= 768px) — STRICTLY FROZEN */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                  {taxonomy.map((group) => (
                    <div key={group.id} className="flex flex-col">
                      <h3 className="text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#718096] mb-3.5">
                        {group.name}
                      </h3>
                      <div className="flex flex-col space-y-2.5">
                        {group.categories.map((cat) => {
                          const isSelected = (selectedFilters[group.id] || []).includes(cat.id);
                          return (
                            <label
                              key={cat.id}
                              className="group flex items-center gap-3 cursor-pointer select-none text-[14.5px] text-[#4A5568] hover:text-[#1A1A1A] transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleFilterChange(group.id, cat.id)}
                                className="sr-only"
                              />
                              <span
                                className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-[#C01718] border-[#C01718]'
                                    : 'bg-white border-[#D5D2CA] group-hover:border-[#1A1A1A]'
                                }`}
                                aria-hidden="true"
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </span>
                              <span className={isSelected ? 'font-medium text-[#1A1A1A]' : ''}>
                                {cat.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. ACTIVE FILTERS TAG ROW */}
        {activeFilterEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718096] mr-1">
              Aktiv:
            </span>
            {activeFilterEntries.map((entry) => (
              <button
                key={`${entry.groupId}-${entry.categoryId}`}
                type="button"
                onClick={() => removeSingleFilter(entry.groupId, entry.categoryId)}
                className="group inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[#FAF9F6] border border-[#E5E2DC] text-[12px] text-[#1A1A1A] hover:border-[#C01718] hover:text-[#C01718] transition-colors cursor-pointer"
              >
                <span>{entry.categoryName}</span>
                <span className="text-sm font-normal leading-none group-hover:text-[#C01718]" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="text-[12px] text-[#C01718] hover:text-[#8B1E1F] font-medium transition-colors ml-1 underline cursor-pointer"
            >
              Alle zurücksetzen
            </button>
          </div>
        )}

      </section>

      {/* 4. OUTFIT LOOKBOOK GRID (Mobile: 2 Columns | Desktop: 3/4 Columns) */}
      <section className="pt-2 sm:pt-4 pb-12 sm:pb-16 lg:pb-24">
        {filteredOutfits.length === 0 ? (
          <div className="py-16 sm:py-20 px-6 text-center max-w-lg mx-auto bg-[#FAF9F6] border border-[#EDEAE4] rounded-sm">
            <h3 className="font-display text-2xl text-[#1A1A1A] mb-2.5">
              Keine Looks gefunden
            </h3>
            <p className="text-[15px] text-[#5A6578] leading-relaxed mb-6">
              Für diese Kombination sind aktuell keine Looks hinterlegt.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors cursor-pointer"
            >
              Filter zurücksetzen →
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 sm:gap-x-8 xl:gap-x-10 gap-y-7 sm:gap-y-16 lg:gap-y-20">
              {filteredOutfits.map((outfit, index) => {
                const focalPoint = outfit.media?.focalPoint || outfit.media?.metadata?.focalPoint || '50% 30%';

                return (
                  <div
                    key={outfit.id}
                    className={`group flex flex-col ${index >= visibleCount ? 'hidden md:flex' : ''}`}
                  >
                    {/* 1. Image Area: 3:4 aspect ratio */}
                    <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
                      {outfit.media?.url ? (
                        <Image
                          src={outfit.media.url}
                          alt={outfit.media.alt || outfit.title}
                          fill
                          sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 33vw, 50vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                          style={{ objectPosition: focalPoint }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center text-[#5A6578]">
                          <span className="font-display text-base">{outfit.title}</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Title */}
                    <h3 className="font-display text-[15px] sm:text-[19px] 2xl:text-[20px] font-normal text-[#1A1A1A] mt-2.5 sm:mt-3.5 leading-snug line-clamp-2">
                      {outfit.title}
                    </h3>

                    {/* 3. Note / Description: Hidden on Mobile (< 768px), Visible on Desktop */}
                    {outfit.note && (
                      <p className="hidden md:block text-[13.5px] text-[#5A6578] mt-1 leading-normal line-clamp-2">
                        {outfit.note}
                      </p>
                    )}

                    {/* 4. Availability Note */}
                    {outfit.availabilityNote && (
                      <span className="text-[11px] sm:text-[12.5px] font-medium text-[#8B1E1F]/90 mt-0.5 sm:mt-1 block line-clamp-1">
                        {outfit.availabilityNote}
                      </span>
                    )}

                    {/* 5. Brands */}
                    {outfit.brands.length > 0 && (
                      <div className="mt-1 sm:mt-2.5 flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#718096] truncate">
                        {outfit.brands.map((brand, idx) => (
                          <span key={brand.id} className="inline-flex items-center">
                            <Link
                              href={`/marken/${brand.slug}` as Route}
                              className="hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]"
                            >
                              {brand.name}
                            </Link>
                            {idx < outfit.brands.length - 1 && (
                              <span className="mx-1 text-[#CBD5E0]" aria-hidden="true">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 5. LOAD MORE CONTROL (Mobile Only — Progressive 12-Item Reveal) */}
            {filteredOutfits.length > visibleCount && (
              <div className="mt-8 text-center md:hidden">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="inline-flex items-center justify-center rounded-sm border border-[#1A1A1A]/30 bg-white hover:bg-[#FAF9F6] hover:border-[#C01718] hover:text-[#C01718] px-6 py-3 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Weitere {filteredOutfits.length - visibleCount} Looks anzeigen</span>
                  <span className="ml-1.5" aria-hidden="true">↓</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 6. BOTTOM STORE CTA */}
      <section className="bg-[#FAF9F6] border-t border-[#EDEAE4] py-12 sm:py-16 lg:py-20 px-6 lg:px-8 2xl:px-12 text-center rounded-sm">
        <div className="mx-auto max-w-2xl">
          <span className="text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718] block mb-2 sm:mb-2.5">
            Im Geschäft entdecken
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] mb-3 leading-snug">
            Welcher Look passt zu Ihnen?
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#4A5568] leading-relaxed mb-6">
            Kommen Sie vorbei – gemeinsam finden wir Farben, Schnitte und Kombinationen, in denen Sie sich wohlfühlen.
          </p>
          <Link
            href={"/kontakt" as Route}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] hover:bg-[#C01718] px-7 py-3 text-[12.5px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 min-h-[44px]"
          >
            Besuchen Sie uns <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
