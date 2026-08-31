'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export type StyleWorldItem = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  focalPoint?: string | null;
  outfitTitle?: string | null;
};

interface ModeStyleWorldsProps {
  styles: StyleWorldItem[];
}

export function ModeStyleWorlds({ styles }: ModeStyleWorldsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  if (!styles || styles.length === 0) return null;

  const activeStyle = styles[activeIndex] || styles[0];

  return (
    <div className="w-full">
      {/* Desktop & Tablet Two-Zone Layout */}
      <div className="hidden lg:grid grid-cols-[1fr_1.15fr] xl:grid-cols-[1fr_1.2fr] gap-12 xl:gap-18 items-center">
        
        {/* Left: Typography-Led Editorial Style Index */}
        <div className="flex flex-col divide-y divide-[#EDEAE4]">
          {styles.map((style, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className="group text-left py-6 xl:py-7 transition-colors duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4"
                aria-pressed={isActive}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <span className="w-5 h-[2px] bg-[#C01718] shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#D5D2CA] group-hover:bg-[#A5A096] shrink-0 transition-colors" aria-hidden="true" />
                    )}
                    <h3
                      className={`font-display text-2xl xl:text-[32px] 2xl:text-[36px] transition-colors leading-tight ${
                        isActive ? 'text-[#1A1A1A] font-normal' : 'text-[#718096] font-normal group-hover:text-[#1A1A1A]'
                      }`}
                    >
                      {style.name}
                    </h3>
                  </div>
                  <span className={`text-[11.5px] 2xl:text-[12px] uppercase tracking-[0.14em] font-semibold transition-colors ${
                    isActive ? 'text-[#C01718]' : 'text-[#A0AEC0]'
                  }`}>
                    {style.subtitle}
                  </span>
                </div>
                
                {isActive && (
                  <p className="mt-3 text-[14.5px] 2xl:text-[15.5px] leading-relaxed text-[#4A5568] max-w-lg pl-8">
                    {style.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Active Style Visual Area */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[1.25/1] max-h-[460px] 2xl:max-h-[520px] rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E5E2DC] shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStyle.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full h-full"
            >
              <Image
                src={activeStyle.imageUrl}
                alt={activeStyle.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={activeStyle.focalPoint ? { objectPosition: activeStyle.focalPoint } : {}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 block mb-1">
                  Stilrichtung
                </span>
                <h4 className="font-display text-2xl xl:text-3xl font-medium tracking-tight">
                  {activeStyle.name}
                </h4>
                {activeStyle.outfitTitle && (
                  <p className="mt-1 text-[13.5px] text-white/90 italic">
                    {activeStyle.outfitTitle}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Mobile & Small Tablet Accordion */}
      <div className="lg:hidden flex flex-col space-y-4">
        {styles.map((style, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={style.id}
              className="bg-white rounded-sm border border-[#EDEAE4] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={isActive}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#C01718]' : 'bg-[#D5D2CA]'}`}
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-xl font-medium text-[#1A1A1A]">
                    {style.name}
                  </h3>
                </div>
                <span className="text-[12px] uppercase tracking-wider text-[#718096]">
                  {style.subtitle}
                </span>
              </button>

              {isActive && (
                <div className="px-5 pb-5 pt-0 border-t border-[#F2EFEB]">
                  <p className="text-[14px] text-[#4A5568] leading-relaxed my-3">
                    {style.description}
                  </p>
                  <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden bg-[#EFECE6] mt-2">
                    <Image
                      src={style.imageUrl}
                      alt={style.imageAlt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      style={style.focalPoint ? { objectPosition: style.focalPoint } : {}}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
