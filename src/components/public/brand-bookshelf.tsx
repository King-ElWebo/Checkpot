'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: {
    url: string;
    alt: string | null;
    focalPoint: string | null;
  } | null;
};

interface BrandBookshelfProps {
  brands: Brand[];
}

export function BrandBookshelf({ brands }: BrandBookshelfProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!brands || brands.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-[#4A5568] bg-[#F9F9F8] rounded-sm">
        Derzeit sind keine Marken verfügbar.
      </div>
    );
  }

  // Split brands into rows of max 5 to prevent extreme squeezing
  const MAX_PER_ROW = 5;
  const rows = [];
  for (let i = 0; i < brands.length; i += MAX_PER_ROW) {
    rows.push(brands.slice(i, i + MAX_PER_ROW));
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.map((rowBrands, rowIndex) => (
        <div key={rowIndex} className="flex flex-col md:flex-row w-full gap-4 md:h-[500px] min-h-[400px]">
          {rowBrands.map((brand, localIndex) => {
            const globalIndex = rowIndex * MAX_PER_ROW + localIndex;
            const isActive = activeIndex === globalIndex;
            const hasImage = !!brand.coverImage;

            // Colors depend on state and image existence
            const textColor = isActive && hasImage ? 'text-white' : 'text-[#1A1A1A]';
            const bgColor = isActive && !hasImage ? 'bg-[#EFECE6]' : 'bg-[#F9F9F8]';
            const linkBorderColor = isActive && hasImage ? 'border-white/40 hover:border-white' : 'border-[#1A1A1A]/30 hover:border-[#1A1A1A]';

            return (
              <motion.div
                key={brand.id}
                layout={shouldReduceMotion ? false : true}
                onMouseEnter={!isMobile ? () => setActiveIndex(globalIndex) : undefined}
                className={`group relative flex flex-col justify-end overflow-hidden rounded-sm border border-[#E2E8F0] ${bgColor} p-6 md:p-8 transition-shadow`}
                animate={{
                  flex: isActive ? (isMobile ? 3 : 3) : 1,
                  minHeight: isMobile && !isActive ? '100px' : 'auto'
                }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 }}
              >
                {/* Background Image Reveal */}
                {hasImage && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeOut' }}
                  >
                    <Image
                      src={brand.coverImage!.url}
                      alt={brand.coverImage!.alt || brand.name}
                      fill
                      className="object-cover"
                      style={brand.coverImage!.focalPoint ? { objectPosition: brand.coverImage!.focalPoint } : {}}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </motion.div>
                )}

                {/* Content Container */}
                <div
                  className={`relative z-10 flex flex-col transition-all duration-400 ease-out ${textColor} ${
                    isActive ? 'translate-y-0' : 'translate-y-2'
                  }`}
                >
                  {/* Semantic Button for Expansion */}
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`brand-content-${brand.id}`}
                    onClick={() => setActiveIndex(globalIndex)}
                    onFocus={() => setActiveIndex(globalIndex)}
                    className="flex flex-col items-start text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
                  >
                    <h3
                      className={`m-0 font-display transition-all duration-400 ease-out whitespace-normal leading-tight ${
                        isActive ? 'text-3xl md:text-4xl font-normal' : 'text-xl md:text-2xl font-medium md:[writing-mode:horizontal-tb]'
                      }`}
                    >
                      {brand.name}
                    </h3>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        id={`brand-content-${brand.id}`}
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.1 }}
                        className="overflow-hidden flex flex-col items-start"
                      >
                        <Link
                          href={`/marken/${brand.slug}`}
                          className={`mt-4 inline-flex items-center border-b pb-1 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm ${linkBorderColor}`}
                        >
                          Marke entdecken <span className="ml-2" aria-hidden="true">→</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
