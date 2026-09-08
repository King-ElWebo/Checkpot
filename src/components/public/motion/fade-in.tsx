"use client";

import { useEffect, useRef, useState } from "react";

export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 600,
  translateY = 10,
  reveal = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  translateY?: number;
  reveal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!reveal);

  useEffect(() => {
    if (!reveal) {
      return;
    }

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setTimeout(() => setIsVisible(true), 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [reveal]);

  const isShown = !reveal || isVisible;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isShown ? 1 : 0,
        transform: isShown ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: reveal
          ? `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
