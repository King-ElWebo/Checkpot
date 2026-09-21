"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "./consent-context";

/**
 * Official Vercel Web Analytics & Speed Insights integration for Next.js App Router.
 *
 * Privacy / Consent Architecture:
 * Strictly gated behind the visitor's explicit 'analytics' consent category.
 * If consent is not given or withdrawn, this component returns null and mounts
 * neither tracking script nor performance reporter.
 */
export function VercelAnalytics() {
  const { consent } = useConsent();

  // Conservative consent gating: only mount when user explicitly granted analytics consent
  if (!consent?.analytics) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
