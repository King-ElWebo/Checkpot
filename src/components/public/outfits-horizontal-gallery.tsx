"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export type HomepageOutfitItem = {
  id: string;
  title: string;
  note?: string | null;
  availabilityNote?: string | null;
  media: {
    url: string;
    alt?: string | null;
    focalPoint?: string | null;
  } | null;
};

interface OutfitsHorizontalGalleryProps {
  outfits: HomepageOutfitItem[];
}

const HEADER_HEIGHT = 80; // Fixed navbar height (h-20 = 80px)

export function OutfitsHorizontalGallery({ outfits }: OutfitsHorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPinnedActive, setIsPinnedActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [leftPadding, setLeftPadding] = useState(32);

  const calculateGeometry = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;

    const viewportWidth = window.innerWidth;
    const isDesktop = viewportWidth >= 1024;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Computed left/right offset aligning with max-w-[1400px] header container
    const computedLeftPadding = Math.max(24, Math.floor((viewportWidth - 1400) / 2) + 32);
    setLeftPadding(computedLeftPadding);

    // If mobile, tablet, reduced-motion, or only 1 outfit, do not pin
    if (!isDesktop || prefersReducedMotion || outfits.length <= 1) {
      setIsPinnedActive(false);
      setSectionHeight(null);
      setMaxTranslate(0);
      if (trackRef.current) {
        trackRef.current.style.transform = "none";
      }
      cardRefs.current.forEach((cardEl) => {
        if (!cardEl) return;
        cardEl.style.opacity = "1";
        const imgBox = cardEl.querySelector<HTMLElement>(".outfit-img-box");
        if (imgBox) imgBox.style.transform = "none";
      });
      return;
    }

    const trackScrollWidth = trackRef.current.scrollWidth;
    // Symmetrical end alignment: last card finishes exactly at right content padding (viewportWidth - computedLeftPadding)
    const horizontalDistance = Math.max(0, trackScrollWidth - viewportWidth + 2 * computedLeftPadding);

    // If all cards already fit on the screen without overflow, do not pin
    if (horizontalDistance <= 60) {
      setIsPinnedActive(false);
      setSectionHeight(null);
      setMaxTranslate(0);
      if (trackRef.current) {
        trackRef.current.style.transform = "none";
      }
      cardRefs.current.forEach((cardEl) => {
        if (!cardEl) return;
        cardEl.style.opacity = "1";
        const imgBox = cardEl.querySelector<HTMLElement>(".outfit-img-box");
        if (imgBox) imgBox.style.transform = "none";
      });
      return;
    }

    const RELEASE_BUFFER = 180; // Intentional rest distance in px after full horizontal travel before release
    setMaxTranslate(horizontalDistance);
    const stickyViewportHeight = window.innerHeight - HEADER_HEIGHT;
    // Outer section height: sticky viewport height + horizontal travel distance + release buffer
    setSectionHeight(stickyViewportHeight + horizontalDistance + RELEASE_BUFFER);
    setIsPinnedActive(true);
  }, [outfits.length]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      calculateGeometry();
    });

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const onResize = () => {
      calculateGeometry();
    };

    window.addEventListener("resize", onResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [calculateGeometry]);

  // Native scroll progress listener using requestAnimationFrame
  useEffect(() => {
    if (!isPinnedActive || maxTranslate <= 0) return;

    let rafId: number;

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current || !trackRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Distance scrolled past the top of the sticky container below header
        const scrolledPastTop = HEADER_HEIGHT - rect.top;
        const progress = Math.min(1, Math.max(0, scrolledPastTop / maxTranslate));
        const currentTranslateX = progress * maxTranslate;

        // 1. Translate horizontal rail
        trackRef.current.style.transform = `translate3d(-${currentTranslateX}px, 0, 0)`;

        // 2. Update subtle desktop progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
        }

        // 3. Pronounced active card focal depth interpolation
        const viewportWidth = window.innerWidth;
        const focalX = viewportWidth * 0.45; // Visual focus sweet spot

        cardRefs.current.forEach((cardEl) => {
          if (!cardEl) return;
          const cardRect = cardEl.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distFromFocal = Math.abs(cardCenter - focalX);
          const normDist = Math.min(1, distFromFocal / (cardRect.width * 1.35));

          // Clearly visible scale (1.03 in focus center down to 0.93 away from center)
          const scale = 1.03 - normDist * 0.10;
          // Opacity (1.0 down to 0.80)
          const opacity = 1 - normDist * 0.20;

          const imgBox = cardEl.querySelector<HTMLElement>(".outfit-img-box");
          if (imgBox) {
            imgBox.style.transform = `scale(${scale.toFixed(4)})`;
            imgBox.style.boxShadow = normDist < 0.35 
              ? "0 14px 28px -6px rgba(0,0,0,0.11), 0 4px 10px -2px rgba(0,0,0,0.05)" 
              : "0 2px 8px rgba(0,0,0,0.03)";
          }
          cardEl.style.opacity = opacity.toFixed(3);
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initialize on mount / position

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isPinnedActive, maxTranslate]);

  if (!outfits || outfits.length === 0) {
    return (
      <section id="discovery" className="bg-[#FAF9F6] px-6 py-16 lg:px-8 lg:py-24 border-y border-[#ECEAE4]">
        <div className="mx-auto max-w-[1400px] text-center py-20 text-lg text-[#4A5568] bg-white rounded-sm border border-[#ECEAE4]">
          Derzeit sind keine Outfits verfügbar.
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="discovery"
      className="relative bg-[#FAF9F6] border-y border-[#EDEAE4] overflow-x-clip isolate"
      style={
        isPinnedActive && sectionHeight
          ? { height: `${sectionHeight}px` }
          : undefined
      }
    >
      <div
        className={
          isPinnedActive
            ? "sticky z-10 flex w-full flex-col justify-start overflow-hidden bg-[#FAF9F6] pt-4 lg:pt-5 2xl:pt-9 pb-3 lg:pb-4 2xl:pb-7"
            : "relative w-full py-16 lg:py-24 bg-[#FAF9F6]"
        }
        style={
          isPinnedActive
            ? {
                top: `${HEADER_HEIGHT}px`,
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                minHeight: "540px",
              }
            : undefined
        }
      >
        {/* Section Header with Integrated Progress Indicator */}
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-8 mb-3 lg:mb-4 2xl:mb-7 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6">
            <div className="max-w-2xl">
              <span className="mb-1.5 2xl:mb-2.5 block text-[12px] 2xl:text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                Boutique Wien-Hietzing
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[38px] 2xl:text-[48px] font-normal leading-[1.12] tracking-tight text-[#1A1A1A]">
                Ausgesuchte Mode<br />mit Persönlichkeit
              </h2>
              <p className="mt-1.5 2xl:mt-2.5 text-[13.5px] sm:text-[15px] 2xl:text-lg leading-relaxed text-[#4A5568]">
                Wir kuratieren Kollektionen, die Ihre Ausstrahlung unterstreichen.
                Entdecken Sie unerwartete Kombinationen in einer entspannten Umgebung.
              </p>
            </div>

            <div className="flex items-center gap-6 pb-1">
              {/* Subtle Desktop Progress Indicator */}
              {isPinnedActive && (
                <div className="hidden lg:flex items-center gap-3" aria-hidden="true">
                  <div className="w-24 xl:w-32 h-[2px] bg-[#E2E0D8] rounded-full overflow-hidden">
                    <div
                      ref={progressBarRef}
                      className="h-full w-full bg-[#C01718] origin-left will-change-transform rounded-full"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </div>
                </div>
              )}

              <Link
                href="/outfits"
                className="group inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors border-b border-[#1A1A1A]/30 hover:border-[#C01718] pb-0.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Alle Outfits ansehen <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery Rail Viewport */}
        <div className="relative w-full overflow-hidden shrink-0 py-2">
          {/* Scroll Track */}
          <div
            ref={trackRef}
            className={
              isPinnedActive
                ? "flex gap-6 lg:gap-7 2xl:gap-8 will-change-transform items-start py-1"
                : "flex gap-5 sm:gap-6 lg:gap-8 overflow-x-auto snap-x scrollbar-none pb-4 px-6 lg:px-8 items-start"
            }
            style={
              isPinnedActive
                ? {
                    paddingLeft: `${leftPadding}px`,
                  }
                : undefined
            }
          >
            {outfits.map((outfit, index) => (
              <div
                key={outfit.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="w-[78vw] max-w-[300px] sm:w-[45vw] sm:max-w-[340px] md:w-[40vw] md:max-w-[360px] lg:w-[min(clamp(280px,24vw,390px),max(240px,calc((100vh-360px)*0.75)))] shrink-0 snap-start group flex flex-col transition-[opacity] duration-200 ease-out"
              >
                <Link
                  href="/outfits"
                  className="outfit-img-box relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-white border border-[#E5E2DC] shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4 will-change-transform transition-transform duration-300 ease-out"
                  tabIndex={0}
                >
                  {outfit.media ? (
                    <Image
                      src={outfit.media.url}
                      alt={outfit.media.alt || outfit.title}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 390px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                      style={outfit.media.focalPoint ? { objectPosition: outfit.media.focalPoint } : {}}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center text-[#4A5568]">
                      <span className="font-display text-xl">{outfit.title}</span>
                    </div>
                  )}
                </Link>

                <div className="mt-2.5 2xl:mt-3.5 flex flex-col items-start gap-0.5">
                  <Link
                    href="/outfits"
                    className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
                  >
                    <h3 className="font-display text-[16px] lg:text-[17.5px] 2xl:text-[19px] font-medium leading-snug text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C01718] line-clamp-2">
                      {outfit.title}
                    </h3>
                  </Link>
                  {outfit.availabilityNote && (
                    <span className="mt-0.5 text-[11px] 2xl:text-[11.5px] font-normal tracking-normal text-[#8B1E1F]/85">
                      {outfit.availabilityNote}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Link at Bottom */}
        <div className="mt-6 px-6 text-center lg:hidden shrink-0">
          <Link
            href="/outfits"
            className="inline-flex items-center justify-center rounded-sm border border-[#E2E8F0] bg-white px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F3F2EE] hover:border-[#1A1A1A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
          >
            Alle Outfits ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
