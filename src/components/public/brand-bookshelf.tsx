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
      <div className="flex items-center justify-center p-12 text-[#4A5568] bg-[#F9F9F8] rounded-xl">
        Derzeit sind keine Marken verfügbar.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 md:h-[650px] min-h-[400px]">
      {brands.map((brand, index) => {
        const isActive = activeIndex === index;
        return (
          <motion.div
            key={brand.id}
            layout={shouldReduceMotion ? false : true}
            onMouseEnter={!isMobile ? () => setActiveIndex(index) : undefined}
            className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F9F9F8] p-6 transition-shadow"
            animate={{
              flex: isActive ? (isMobile ? 3 : 3.5) : 1,
              minHeight: isMobile && !isActive ? '100px' : 'auto'
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 }}
          >
            {/* Background Image Reveal */}
            {brand.coverImage && (
              <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
              >
                <Image
                  src={brand.coverImage.url}
                  alt={brand.coverImage.alt || brand.name}
                  fill
                  className="object-cover"
                  style={brand.coverImage.focalPoint ? { objectPosition: brand.coverImage.focalPoint } : {}}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </motion.div>
            )}

            {/* Content Container */}
            <div
              className={`relative z-10 flex flex-col transition-all duration-500 ease-out ${
                isActive ? 'translate-y-0 text-white' : 'translate-y-2 text-[#1A1A1A] md:translate-y-4'
              }`}
            >
              {/* Semantic Button for Expansion */}
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={`brand-content-${brand.id}`}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className="flex flex-col items-start text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
              >
                <span
                  className={`mb-3 block text-[12px] font-medium uppercase tracking-[0.08em] transition-opacity duration-300 ${
                    isActive ? 'opacity-90' : 'opacity-60'
                  }`}
                >
                  Kollektion
                </span>
                <h3
                  className={`m-0 font-display transition-all duration-400 ease-out ${
                    isActive ? 'text-3xl md:text-4xl font-normal whitespace-normal' : 'text-xl md:text-2xl md:whitespace-nowrap md:overflow-hidden md:text-ellipsis'
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
                    {brand.description && (
                      <p className="max-w-[300px] text-[15px] leading-relaxed text-white/90">
                        {brand.description.substring(0, 100)}
                        {brand.description.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <Link
                      href={`/marken/${brand.slug}`}
                      className="mt-6 inline-flex items-center border-b border-white/40 pb-1 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:border-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      Kollektion ansehen <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
