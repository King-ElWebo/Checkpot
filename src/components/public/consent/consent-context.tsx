"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ConsentState,
  CONSENT_COOKIE_NAME,
  parseConsentCookie,
  serializeConsentCookie,
} from "@/lib/consent/types";
import { updateGoogleConsent, cleanupGoogleAnalyticsCookies } from "@/lib/consent/ga";

interface ConsentContextValue {
  consent: ConsentState | null;
  isBannerOpen: boolean;
  isSettingsOpen: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  saveSettings: (analytics: boolean, externalMedia: boolean) => void;
  acceptExternalMedia: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({
  initialConsent,
  children,
}: {
  initialConsent: ConsentState | null;
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<ConsentState | null>(() => {
    if (initialConsent) return initialConsent;
    if (typeof document !== "undefined") {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(CONSENT_COOKIE_NAME + "="));
      if (match) {
        const rawValue = match.substring((CONSENT_COOKIE_NAME + "=").length);
        return parseConsentCookie(rawValue);
      }
    }
    return null;
  });

  const [isBannerOpen, setIsBannerOpen] = useState<boolean>(() => {
    if (initialConsent !== null) return false;
    if (typeof document !== "undefined") {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(CONSENT_COOKIE_NAME + "="));
      if (match) {
        const rawValue = match.substring((CONSENT_COOKIE_NAME + "=").length);
        return parseConsentCookie(rawValue) === null;
      }
    }
    return true;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync Google Consent Mode with existing consent once on mount
  useEffect(() => {
    if (consent) {
      updateGoogleConsent(consent.analytics);
    }
  }, [consent]);

  const applyConsent = useCallback((analytics: boolean, externalMedia: boolean = false) => {
    document.cookie = serializeConsentCookie(analytics, externalMedia);
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(CONSENT_COOKIE_NAME + "="));
    const rawValue = match ? match.substring((CONSENT_COOKIE_NAME + "=").length) : null;
    const updated = parseConsentCookie(rawValue);
    setConsent(updated);
    setIsBannerOpen(false);
    setIsSettingsOpen(false);

    updateGoogleConsent(analytics);

    if (!analytics) {
      cleanupGoogleAnalyticsCookies();
    }
  }, []);

  const acceptAll = useCallback(() => {
    applyConsent(true, true);
  }, [applyConsent]);

  const acceptNecessaryOnly = useCallback(() => {
    applyConsent(false, false);
  }, [applyConsent]);

  const saveSettings = useCallback(
    (analytics: boolean, externalMedia: boolean) => {
      applyConsent(analytics, externalMedia);
    },
    [applyConsent]
  );

  const acceptExternalMedia = useCallback(() => {
    const currentAnalytics = consent?.analytics ?? false;
    applyConsent(currentAnalytics, true);
  }, [consent, applyConsent]);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const closeBanner = useCallback(() => {
    setIsBannerOpen(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        isBannerOpen,
        isSettingsOpen,
        acceptAll,
        acceptNecessaryOnly,
        saveSettings,
        acceptExternalMedia,
        openSettings,
        closeSettings,
        closeBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
