"use client";

import { useTransition } from "react";
import Link from "next/link";
import { endSitePreviewAction } from "@/app/admin/actions/site-access";

export function PreviewBanner() {
  const [isPending, startTransition] = useTransition();

  return (
    <aside
      aria-label="Admin Vorschau Status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/15 text-xs font-medium backdrop-blur-md max-w-[95vw]"
    >
      <span className="flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#E53E3E] animate-pulse" aria-hidden="true" />
        <span className="hidden sm:inline">Vorschau-Modus aktiv (Website gesperrt)</span>
        <span className="sm:hidden">Vorschau aktiv</span>
      </span>

      <div className="flex items-center gap-2 ml-1 pl-2 border-l border-white/20 shrink-0">
        <Link
          href="/admin"
          className="text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors px-1"
        >
          Dashboard
        </Link>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await endSitePreviewAction();
            });
          }}
          className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-full transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Beenden..." : "Vorschau beenden"}
        </button>
      </div>
    </aside>
  );
}
