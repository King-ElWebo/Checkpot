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

  const [isPinnedActive, setIsPinnedActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [leftPadding, setLeftPadding] = useState(32);

  const calculateGeometry = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;

    const viewportWidth = window.innerWidth;
    const isDesktop = viewportWidth >= 1024;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Computed left offset aligning with max-w-[1400px] header container
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
      return;
    }

    const trackScrollWidth = trackRef.current.scrollWidth;
    const endBreathingRoom = 80;
    const horizontalDistance = Math.max(0, trackScrollWidth - viewportWidth + endBreathingRoom);

    // If all cards already fit on the screen without overflow, do not pin
    if (horizontalDistance <= 80) {
      setIsPinnedActive(false);
      setSectionHeight(null);
      setMaxTranslate(0);
      if (trackRef.current) {
        trackRef.current.style.transform = "none";
      }
      return;
    }

    setMaxTranslate(horizontalDistance);
    const stickyViewportHeight = window.innerHeight - HEADER_HEIGHT;
    // Outer section height: sticky viewport height + horizontal travel distance
    setSectionHeight(stickyViewportHeight + horizontalDistance);
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

        trackRef.current.style.transform = `translate3d(-${currentTranslateX}px, 0, 0)`;
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
      <section id="discovery" className="bg-white px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1400px] text-center py-20 text-lg text-[#4A5568] bg-[#F9F9F8] rounded-sm">
          Derzeit sind keine Outfits verfügbar.
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="discovery"
      className="relative bg-white"
      style={
        isPinnedActive && sectionHeight
          ? { height: `${sectionHeight}px` }
          : undefined
      }
    >
      <div
        className={
          isPinnedActive
            ? "sticky z-10 flex w-full flex-col justify-center overflow-hidden bg-white py-8"
            : "relative w-full py-16 lg:py-24 bg-white"
        }
        style={
          isPinnedActive
            ? {
                top: `${HEADER_HEIGHT}px`,
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              }
            : undefined
        }
      >
        {/* Section Header */}
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-8 mb-8 lg:mb-10 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                Boutique Hietzing
              </span>
              <h2 className="font-display text-4xl font-normal tracking-tight text-[#1A1A1A] sm:text-5xl">
                Ausgesuchte Mode<br />mit Persönlichkeit
              </h2>
              <p className="mt-4 text-lg sm:text-xl leading-relaxed text-[#4A5568]">
                Wir kuratieren Kollektionen, die Ihre Ausstrahlung unterstreichen.
                Entdecken Sie unerwartete Kombinationen in einer entspannten Umgebung.
              </p>
            </div>
            <div className="pb-1">
              <Link
                href="/outfits"
                className="inline-flex items-center text-[14px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Alle Outfits ansehen <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery Rail Viewport */}
        <div className="relative w-full overflow-hidden shrink-0">
          {/* Scroll Track */}
          <div
            ref={trackRef}
            className={
              isPinnedActive
                ? "flex gap-6 lg:gap-8 will-change-transform"
                : "flex gap-6 lg:gap-8 overflow-x-auto snap-x scrollbar-none pb-4 px-6 lg:px-8"
            }
            style={
              isPinnedActive
                ? {
                    paddingLeft: `${leftPadding}px`,
                  }
                : undefined
            }
          >
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] shrink-0 snap-start group flex flex-col gap-4 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0"
              >
                <Link
                  href="/outfits"
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F8] border border-[#ECEAE4] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4"
                  tabIndex={0}
                >
                  {outfit.media ? (
                    <Image
                      src={outfit.media.url}
                      alt={outfit.media.alt || outfit.title}
                      fill
                      sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 380px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                      style={outfit.media.focalPoint ? { objectPosition: outfit.media.focalPoint } : {}}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center text-[#4A5568]">
                      <span className="font-display text-xl">{outfit.title}</span>
                    </div>
                  )}
                </Link>

                <div className="flex flex-col items-start gap-1">
                  <Link
                    href="/outfits"
                    className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
                  >
                    <h3 className="font-display text-xl font-medium text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C01718]">
                      {outfit.title}
                    </h3>
                  </Link>
                  {outfit.availabilityNote && (
                    <span className="text-[13px] text-[#991b1b] font-medium">
                      {outfit.availabilityNote}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Link at Bottom */}
        <div className="mt-8 px-6 text-center lg:hidden shrink-0">
          <Link
            href="/outfits"
            className="inline-flex items-center justify-center rounded-sm border border-[#E2E8F0] bg-white px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F3F2EE] hover:border-[#1A1A1A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
          >
            Alle Outfits ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
