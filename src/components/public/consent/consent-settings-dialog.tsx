"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useConsent } from "./consent-context";

function SettingsModalContent() {
  const { closeSettings, consent, saveSettings, acceptAll } = useConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(consent?.analytics ?? false);
  const modalRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    saveButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSettings]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-opacity"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.18)] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#ECEAE4]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-[2px] bg-[#C01718]" aria-hidden="true" />
              <h2 id="consent-settings-title" className="font-display text-xl sm:text-2xl font-medium text-[#1A1A1A]">
                Datenschutzeinstellungen
              </h2>
            </div>
            <p className="text-[13px] text-[#718096] leading-relaxed">
              Wählen Sie, welche Dienste und Cookies Sie auf Checkpot aktivieren möchten.
            </p>
          </div>
          <button
            type="button"
            onClick={closeSettings}
            className="text-[#718096] hover:text-[#1A1A1A] p-1 -mr-2 text-xl leading-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 py-6">
          <div className="bg-[#FAF9F6] border border-[#ECEAE4] rounded-sm p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-[15px] text-[#1A1A1A]">Technisch notwendig</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#ECEAE4] text-[#4A5568] px-2 py-0.5 rounded-xs">
                  Immer aktiv
                </span>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="w-4 h-4 text-[#C01718] rounded-xs cursor-not-allowed opacity-75"
                aria-label="Technisch notwendig (immer aktiv)"
              />
            </div>
            <p className="text-[13px] text-[#4A5568] leading-relaxed">
              Erforderlich für grundlegende Funktionen der Website, sichere Formulare und zum Speichern Ihrer Datenschutzauswahl (<code className="text-[11px] bg-white px-1 py-0.5 rounded-xs border border-[#ECEAE4]">checkpot_consent</code>, 180 Tage).
            </p>
          </div>

          <div className="bg-white border border-[#E5E2DC] rounded-sm p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[15px] text-[#1A1A1A]">Statistik</h3>
                <span className="text-[11px] text-[#718096]">Google Analytics 4</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Statistik (Google Analytics 4) aktivieren"
                />
                <div className="w-11 h-6 bg-[#D5D2CA] peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-[#C01718] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C01718]"></div>
              </label>
            </div>
            <p className="text-[13px] text-[#4A5568] leading-relaxed">
              Hilft uns zu verstehen, welche Kollektionen und Seiten besucht werden, um unser Angebot kontinuierlich zu verbessern. Daten werden erst nach Ihrer Zustimmung erfasst.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#ECEAE4] flex flex-col gap-4">
          <p className="text-[12px] text-[#718096] leading-relaxed">
            Detaillierte Informationen zu Cookies und Ihren Rechten finden Sie in unserer{" "}
            <Link
              href="/datenschutz"
              onClick={closeSettings}
              className="text-[#C01718] underline hover:text-[#A01314]"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              ref={saveButtonRef}
              type="button"
              onClick={() => saveSettings(analyticsEnabled)}
              className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#333333] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            >
              Auswahl speichern
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#C01718] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] !text-white text-white hover:bg-[#A01314] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConsentSettingsDialog() {
  const { isSettingsOpen } = useConsent();
  if (!isSettingsOpen) return null;
  return <SettingsModalContent />;
}

