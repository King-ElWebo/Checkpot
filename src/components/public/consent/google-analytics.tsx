"use client";

import { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useConsent } from "./consent-context";
import { getGaMeasurementId } from "@/lib/consent/ga";

function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { consent } = useConsent();

  useEffect(() => {
    if (!consent?.analytics) return;
    if (typeof window === "undefined" || !window.gtag) return;

    const url = searchParams?.size ? pathname + "?" + searchParams.toString() : pathname;
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, searchParams, consent?.analytics, measurementId]);

  return null;
}

export function GoogleAnalytics() {
  const { consent } = useConsent();
  const measurementId = getGaMeasurementId();

  // BASIC Consent Mode: If consent is not given or no measurementId is set, DO NOT LOAD any Google scripts or tags.
  if (!consent?.analytics || !measurementId) {
    return null;
  }

  const initScript = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('consent', 'default', {",
    "  'analytics_storage': 'granted',",
    "  'ad_storage': 'denied',",
    "  'ad_user_data': 'denied',",
    "  'ad_personalization': 'denied'",
    "});",
    "gtag('js', new Date());",
    "gtag('config', '" + measurementId + "', {",
    "  send_page_view: false,",
    "  anonymize_ip: true",
    "});"
  ].join("\n");

  return (
    <>
      <Script
        id="ga4-consent-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
      <Script
        id="ga4-gtag-src"
        strategy="afterInteractive"
        src={"https://www.googletagmanager.com/gtag/js?id=" + measurementId}
      />
      <Suspense fallback={null}>
        <PageViewTracker measurementId={measurementId} />
      </Suspense>
    </>
  );
}
