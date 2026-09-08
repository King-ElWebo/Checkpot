import Link from "next/link";
import type { Route } from "next";

interface LegalMaintenanceShellProps {
  children: React.ReactNode;
}

export function LegalMaintenanceShell({ children }: LegalMaintenanceShellProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Isolated Minimal Header — NO public navigation */}
      <header className="border-b border-[#E8E5DF] bg-[#FAF9F6]/95 backdrop-blur-xs py-4 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link
            href={"/" as Route}
            className="flex items-center gap-2.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
            aria-label="Checkpot Startseite"
          >
            <span className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A]">
              Checkpot
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C01718]" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-[#718096] hidden sm:inline-block">
              Hietzing
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] bg-[#FDF2F2] border border-[#FCDAD9] px-3 py-1 rounded-full">
              In Vorbereitung
            </span>
            <Link
              href={"/" as Route}
              className="text-xs font-medium text-[#4A5568] hover:text-[#1A1A1A] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs flex items-center gap-1.5"
            >
              <span aria-hidden="true">←</span>
              <span>Zurück zur Übersicht</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Canonical Legal Content Container */}
      <main className="flex-1">
        {children}
      </main>

      {/* Isolated Quiet Footer — NO public navigation links */}
      <footer className="border-t border-[#E8E5DF] py-6 px-6 sm:px-8 lg:px-12 bg-[#FAF9F6] text-xs text-[#718096]">
        <div className="mx-auto flex max-w-[1200px] flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} Checkpot Hietzing Boutique · Christa Hausmair</p>
          <div className="flex items-center gap-5">
            <Link
              href={"/impressum" as Route}
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
            >
              Impressum
            </Link>
            <span aria-hidden="true" className="text-[#D5D2CA]">·</span>
            <Link
              href={"/datenschutz" as Route}
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-xs"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
