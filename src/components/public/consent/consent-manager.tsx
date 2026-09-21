"use client";

import React from "react";
import { ConsentProvider } from "./consent-context";
import { ConsentBanner } from "./consent-banner";
import { ConsentSettingsDialog } from "./consent-settings-dialog";
import { GoogleAnalytics } from "./google-analytics";
import { VercelAnalytics } from "./vercel-analytics";
import { ConsentState } from "@/lib/consent/types";

export function ConsentManager({
  initialConsent,
  children,
}: {
  initialConsent: ConsentState | null;
  children: React.ReactNode;
}) {
  return (
    <ConsentProvider initialConsent={initialConsent}>
      {children}
      <GoogleAnalytics />
      <VercelAnalytics />
      <ConsentBanner />
      <ConsentSettingsDialog />
    </ConsentProvider>
  );
}

export { useConsent } from "./consent-context";
