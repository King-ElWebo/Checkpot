'use client';

import React, { useState, useEffect } from 'react';
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
  description?: string | null;
  image?: Media | null;
  logo?: Media | null;
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
  const rows: Brand[][] = [];
  for (let i = 0; i < brands.length; i += MAX_PER_ROW) {
    rows.push(brands.slice(i, i + MAX_PER_ROW));
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.map((rowBrands, rowIndex) => (
        <div key={rowIndex} className="flex flex-col md:flex-row w-full gap-4 md:h-[440px] min-h-[350px]">
          {rowBrands.map((brand, localIndex) => {
            const globalIndex = rowIndex * MAX_PER_ROW + localIndex;
            const isActive = activeIndex === globalIndex;
            
            // Asset hierarchy & safeguard: Never use Checkpot logo on other brands
            const isCheckpot = brand.slug === 'checkpot';
            const validLogoUrl = brand.logo?.url && (!brand.logo.url.toLowerCase().includes('checkpot-logo') || isCheckpot)
              ? brand.logo.url
              : null;
            const hasLogo = Boolean(validLogoUrl);
            const hasImage = Boolean(brand.image?.url);
            
            // Visual presentation logic
            const useImageReveal = isActive && hasImage;
            const bgColor = isActive && !useImageReveal ? 'bg-[#EFECE6]' : 'bg-[#F9F9F8]';

            return (
              <motion.div
                key={brand.id}
                layout={shouldReduceMotion ? false : true}
                onMouseEnter={!isMobile ? () => setActiveIndex(globalIndex) : undefined}
                className={`group relative flex flex-col justify-end overflow-hidden rounded-sm border ${
                  isActive ? 'border-[#D1D5DB]' : 'border-[#E2E8F0] hover:border-[#C01718]/40'
                } ${bgColor} transition-colors focus-within:border-[#C01718]`}
                animate={{
                  flex: isActive ? (isMobile ? 3 : 3) : 1,
                  minHeight: isMobile && !isActive ? '110px' : 'auto'
                }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 28 }}
              >
                {/* 1. CLOSED STATE PRESENTATION */}
                {!isActive && (
                  <motion.div 
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 pointer-events-none"
                  >
                    {/* Upper/Center Visual Area */}
                    <div className="flex-1 w-full flex items-center justify-center py-4">
                      {hasLogo ? (
                        <div className="relative w-full h-[55px] md:h-[85px] max-w-[150px] transition-all duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100 opacity-90 group-hover:opacity-100">
                          <Image 
                            src={validLogoUrl!}
                            alt={brand.logo?.alt || `${brand.name} Logo`}
                            fill
                            className="object-contain object-center"
                            sizes="(max-width: 768px) 140px, 180px"
                          />
                        </div>
                      ) : (
                        <div className="text-center px-2">
                          <span className="font-display text-2xl md:text-3xl font-medium tracking-tight text-[#1A1A1A] group-hover:text-[#C01718] transition-colors leading-tight">
                            {brand.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Area: Strong, legible Brand Name */}
                    <div className="w-full pt-2 border-t border-[#E2E8F0]/60">
                      <p className="font-display text-[16px] md:text-[18px] font-medium text-[#1A1A1A] leading-snug w-full text-center md:text-left break-words">
                        {brand.name}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 2. ACTIVE WITH IMAGE REVEAL */}
                {useImageReveal && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeOut' }}
                  >
                    <Image
                      src={brand.image!.url}
                      alt={brand.image!.alt || brand.name}
                      fill
                      className="object-cover"
                      style={brand.image!.focalPoint ? { objectPosition: brand.image!.focalPoint } : {}}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
                  </motion.div>
                )}
                
                {/* 3. ACTIVE WITHOUT IMAGE (FALLBACK DESIGN) */}
                {isActive && !hasImage && hasLogo && (
                  <motion.div
                    className="absolute inset-0 z-0 flex items-center justify-end p-8 opacity-[0.06] pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.06 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-[140%] h-[140%] -mr-[15%]">
                      <Image 
                        src={validLogoUrl!}
                        alt=""
                        fill
                        className="object-contain object-right"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 4. INTERACTIVE TRIGGER & ACTIVE CONTENT */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end p-5 md:p-7">
                  {/* Semantic Button for Expanding the Panel */}
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`brand-content-${brand.id}`}
                    onClick={() => setActiveIndex(globalIndex)}
                    onFocus={() => setActiveIndex(globalIndex)}
                    className={`flex flex-col text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 rounded-sm w-full ${
                      isActive ? 'mt-auto' : 'h-full justify-end'
                    }`}
                  >
                    {isActive ? (
                      <h3
                        style={useImageReveal ? { color: '#ffffff' } : { color: '#1A1A1A' }}
                        className={`m-0 font-display text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight ${
                          useImageReveal ? '!text-white text-white drop-shadow-md' : 'text-[#1A1A1A]'
                        }`}
                      >
                        {brand.name}
                      </h3>
                    ) : (
                      // Invisible click target matching bounds when closed
                      <span className="sr-only">{brand.name} öffnen</span>
                    )}
                  </button>

                  {/* Active Details & Action Link */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        id={`brand-content-${brand.id}`}
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.08 }}
                        className="overflow-hidden flex flex-col items-start w-full"
                      >
                        {brand.description && (
                          <p
                            style={useImageReveal ? { color: 'rgba(255, 255, 255, 0.92)' } : { color: '#4A5568' }}
                            className={`text-[15px] leading-relaxed line-clamp-3 md:line-clamp-4 max-w-lg ${
                              useImageReveal ? '!text-white text-white font-normal' : 'text-[#4A5568]'
                            }`}
                          >
                            {brand.description}
                          </p>
                        )}
                        <Link
                          href={`/marken/${brand.slug}`}
                          style={useImageReveal ? { color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.85)' } : undefined}
                          className={`mt-6 inline-flex items-center pb-1 text-[13px] font-semibold uppercase tracking-[0.08em] transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
                            useImageReveal
                              ? '!text-white text-white border-b !border-white/85 hover:!border-white hover:!text-white focus-visible:ring-white focus-visible:ring-offset-black/50 drop-shadow-sm'
                              : 'text-[#1A1A1A] border-b border-[#1A1A1A]/40 hover:text-[#C01718] hover:border-[#C01718] focus-visible:ring-[#C01718]'
                          }`}
                        >
                          <span className={useImageReveal ? '!text-white text-white' : ''}>Marke entdecken</span>
                          <span className={`ml-2 ${useImageReveal ? '!text-white text-white' : ''}`} aria-hidden="true">→</span>
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
