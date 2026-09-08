import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { redirect } from "next/navigation";

import "./public.css";
import { cookies, headers } from "next/headers";
import { Navbar } from "@/components/public/layout/navbar";
import { Footer } from "@/components/public/layout/footer";
import { getSiteUrl } from "@/lib/site-config";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { getSiteAccess } from "@/lib/repositories/site-access";
import { PREVIEW_COOKIE_NAME, verifySitePreviewToken } from "@/lib/auth/preview";
import { CONSENT_COOKIE_NAME, parseConsentCookie } from "@/lib/consent/types";
import { ConsentManager } from "@/components/public/consent/consent-manager";
import { ComingSoon } from "@/components/public/coming-soon";
import { PreviewBanner } from "@/components/public/preview-banner";

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const siteAccess = await getSiteAccess();

  if (siteAccess.maintenanceMode) {
    return {
      title: "Checkpot Hietzing — Wir sind bald für Sie da",
      description:
        "Unsere Boutique in Wien-Hietzing ist natürlich weiterhin persönlich für Sie da. Die neue Checkpot Website wird gerade für Sie vorbereitet.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Checkpot Hietzing",
      template: "%s | Checkpot Hietzing",
    },
    description:
      "Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing. Nachhaltige Kollektionen und ausgewählte Marken.",
    openGraph: {
      title: "Checkpot Hietzing",
      description:
        "Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing.",
      url: siteUrl,
      siteName: "Checkpot Hietzing",
      images: [
        {
          url: "/customer/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Checkpot Hietzing Store Außenansicht",
        },
      ],
      locale: "de_AT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Checkpot Hietzing",
      description: "Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing.",
      images: ["/customer/og-image.jpg"],
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [storeDetails, siteAccess, cookieStore, headerList] = await Promise.all([
    getStoreDetails(),
    getSiteAccess(),
    cookies(),
    headers(),
  ]);

  const rawConsentCookie = cookieStore.get(CONSENT_COOKIE_NAME)?.value;
  const initialConsent = parseConsentCookie(rawConsentCookie);

  const previewCookie = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;
  const isPreviewActive = previewCookie ? await verifySitePreviewToken(previewCookie) : false;

  const pathname = headerList.get("x-pathname") || "/";
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const isLegalRoute = normalizedPath === "/impressum" || normalizedPath === "/datenschutz";

  // Server-side enforcement: Locked visitors see Coming Soon unless preview is active or accessing legal info
  if (siteAccess.maintenanceMode && !isPreviewActive && !isLegalRoute) {
    if (normalizedPath !== "/") {
      redirect("/");
    }

    return (
      <div className={`public-site ${fontHeading.variable} ${fontBody.variable} flex min-h-screen flex-col antialiased`}>
        <ComingSoon storeDetails={storeDetails} />
      </div>
    );
  }

  return (
    <ConsentManager initialConsent={initialConsent}>
      <div className={`public-site ${fontHeading.variable} ${fontBody.variable} flex min-h-screen flex-col antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer storeDetails={storeDetails} />
        {siteAccess.maintenanceMode && isPreviewActive && <PreviewBanner />}
      </div>
    </ConsentManager>
  );
}
