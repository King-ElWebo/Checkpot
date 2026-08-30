"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";

export function StaggeredList({
  children,
  className = "",
  staggerDelay = 100,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setTimeout(() => setIsVisible(true), 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const childProps = child.props as { className?: string };
        const childClass = childProps?.className || "";
        // Forward col-span classes to the grid item wrapper
        const colSpanMatches = childClass.match(/(?:(?:sm|md|lg|xl|2xl):)?col-span-\d+/g) || [];
        const colSpanClass = colSpanMatches.join(" ");

        return (
          <div
            className={`flex flex-col ${colSpanClass}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease-out ${index * staggerDelay}ms, transform 500ms ease-out ${index * staggerDelay}ms`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
