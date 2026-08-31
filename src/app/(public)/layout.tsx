import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import "./public.css";
import { cookies } from "next/headers";
import { Navbar } from "@/components/public/layout/navbar";
import { Footer } from "@/components/public/layout/footer";
import { getSiteUrl } from "@/lib/site-config";
import { getStoreDetails } from "@/lib/repositories/store-settings";
import { CONSENT_COOKIE_NAME, parseConsentCookie } from "@/lib/consent/types";
import { ConsentManager } from "@/components/public/consent/consent-manager";

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

export const metadata: Metadata = {
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

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const storeDetails = await getStoreDetails();
  const cookieStore = await cookies();
  const rawConsentCookie = cookieStore.get(CONSENT_COOKIE_NAME)?.value;
  const initialConsent = parseConsentCookie(rawConsentCookie);

  return (
    <ConsentManager initialConsent={initialConsent}>
      <div className={`public-site ${fontHeading.variable} ${fontBody.variable} flex min-h-screen flex-col antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer storeDetails={storeDetails} />
      </div>
    </ConsentManager>
  );
}

