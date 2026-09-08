"use client";

import { useState, useTransition, useEffect } from "react";
import type { SiteAccessSettings } from "@/lib/repositories/site-access";
import {
  toggleSiteAccessAction,
  startSitePreviewAction,
} from "@/app/admin/actions/site-access";

interface SiteAccessCardProps {
  initialSiteAccess: SiteAccessSettings;
}

export function SiteAccessCard({ initialSiteAccess }: SiteAccessCardProps) {
  const [overrideLocked, setOverrideLocked] = useState<boolean | null>(null);
  const [prevInitial, setPrevInitial] = useState(initialSiteAccess.maintenanceMode);
  const [isPending, startTransition] = useTransition();
  const [isPreviewPending, startPreviewTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (prevInitial !== initialSiteAccess.maintenanceMode) {
    setPrevInitial(initialSiteAccess.maintenanceMode);
    setOverrideLocked(null);
  }

  const isLocked = overrideLocked !== null ? overrideLocked : initialSiteAccess.maintenanceMode;

  // Handle ESC key for modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleConfirmToggle = () => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const result = await toggleSiteAccessAction(!isLocked);
        setOverrideLocked(result.maintenanceMode);
        setIsModalOpen(false);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Fehler beim Ändern des Website-Status."
        );
      }
    });
  };

  const handleStartPreview = () => {
    startPreviewTransition(async () => {
      await startSitePreviewAction();
    });
  };

  return (
    <>
      <section
        aria-labelledby="site-access-heading"
        className={`p-6 bg-white border rounded-2xl transition-all shadow-xs ${
          isLocked
            ? "border-[#FED7AA] bg-[#FFFBF5]"
            : "border-[#e7e5e4] hover:border-[#d6d3d1]"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status & Info */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 font-bold ${
                isLocked ? "bg-[#FFEDD5] text-[#EA580C]" : "bg-[#DCFCE7] text-[#16A34A]"
              }`}
              aria-hidden="true"
            >
              {isLocked ? "🔒" : "🌐"}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isLocked ? "bg-[#EA580C] animate-pulse" : "bg-[#16A34A]"
                  }`}
                  aria-hidden="true"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                  {isLocked ? "Coming Soon aktiv" : "Website online"}
                </span>
              </div>

              <h2
                id="site-access-heading"
                className="text-lg font-bold text-[#1c1917] mt-1 leading-snug"
              >
                {isLocked
                  ? "Die Website ist für Besucher gesperrt"
                  : "Die Website ist öffentlich erreichbar"}
              </h2>

              <p className="text-xs text-[#78716c] mt-0.5 max-w-lg">
                {isLocked
                  ? "Normale Besucher sehen derzeit die Checkpot Coming-Soon-Seite mit Kontaktdaten. Impressum und Datenschutz bleiben erreichbar."
                  : "Besucher haben uneingeschränkten Zugriff auf die gesamte Checkpot Boutique Website."}
              </p>

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-2 text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-1.5 rounded-md"
                >
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 md:pt-0 shrink-0">
            {isLocked && (
              <button
                type="button"
                onClick={handleStartPreview}
                disabled={isPreviewPending || isPending}
                className="inline-flex items-center justify-center rounded-xl bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#1c1917] px-4 py-2.5 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPreviewPending ? "Öffne..." : "👁️ Vorschau öffnen"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={isPending || isPreviewPending}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
                isLocked
                  ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs"
                  : "bg-[#1c1917] hover:bg-[#C01718] text-white shadow-xs"
              }`}
            >
              {isLocked ? "Website veröffentlichen" : "Website sperren"}
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#e7e5e4] flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                  isLocked ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                }`}
              >
                {isLocked ? "🌐" : "⚠️"}
              </div>
              <h3 id="confirm-modal-title" className="text-base font-bold text-[#1c1917]">
                {isLocked ? "Website veröffentlichen?" : "Website sperren?"}
              </h3>
            </div>

            <p id="confirm-modal-desc" className="text-sm text-[#57534e] leading-relaxed">
              {isLocked
                ? "Danach ist die vollständige Checkpot Website sofort wieder für alle Besucher öffentlich erreichbar."
                : "Besucher sehen anschließend nur noch die Checkpot Coming-Soon-Seite. Admin-Bereich und Vorschau bleiben uneingeschränkt erreichbar."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#57534e] hover:bg-[#f5f5f4] transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmToggle}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 ${
                  isLocked
                    ? "bg-[#16A34A] hover:bg-[#15803D]"
                    : "bg-[#DC2626] hover:bg-[#B91C1C]"
                }`}
              >
                {isPending
                  ? "Wird verarbeitet..."
                  : isLocked
                  ? "Website veröffentlichen"
                  : "Website sperren"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
