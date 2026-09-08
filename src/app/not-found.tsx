import Link from "next/link";
import type { Route } from "next";
import { getSiteAccess } from "@/lib/repositories/site-access";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { ComingSoon } from "@/components/public/coming-soon";

export default async function NotFound() {
  const [siteAccess, storeDetails] = await Promise.all([
    getSiteAccess(),
    getStoreDetails(),
  ]);

  if (siteAccess.maintenanceMode) {
    return <ComingSoon storeDetails={storeDetails} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] text-[#1A1A1A] p-6 text-center">
      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C01718] mb-3">
        Fehler 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-display font-normal text-[#1A1A1A] mb-3">
        Seite nicht gefunden
      </h1>
      <p className="text-base text-[#4A5568] max-w-md mb-6">
        Die angeforderte Seite konnte leider nicht gefunden werden oder wurde verschoben.
      </p>
      <Link
        href={"/" as Route}
        className="inline-flex px-6 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-xs hover:bg-[#C01718] transition-colors"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
