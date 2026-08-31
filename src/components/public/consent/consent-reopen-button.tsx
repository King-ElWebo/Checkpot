"use client";

import { useConsent } from "./consent-context";

export function ConsentReopenButton({
  className = "hover:text-[#C01718] text-left transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#C01718]",
}: {
  className?: string;
}) {
  const { openSettings } = useConsent();

  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
