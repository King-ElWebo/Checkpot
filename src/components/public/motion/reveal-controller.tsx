"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsObserver = "IntersectionObserver" in window;

    if (prefersReduced || !supportsObserver) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        element.dataset.revealState = "revealed";
      });
      return;
    }

    document.documentElement.classList.add("motion-enhanced");
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealState = "revealed";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    function observeElement(element: HTMLElement) {
      if (observed.has(element) || element.dataset.revealState === "revealed") {
        return;
      }

      observed.add(element);
      element.dataset.revealState = "pending";

      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.92) {
        requestAnimationFrame(() => {
          element.dataset.revealState = "revealed";
        });
        return;
      }

      observer.observe(element);
    }

    function scan() {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observeElement);
    }

    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(scan);
    });

    window.requestAnimationFrame(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const fallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal][data-reveal-state="pending"]').forEach((element) => {
        element.dataset.revealState = "revealed";
      });
    }, 1400);

    return () => {
      window.clearTimeout(fallback);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
