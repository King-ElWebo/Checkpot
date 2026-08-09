import type { ReactNode } from "react";
import { Inter, Outfit } from "next/font/google";
import type { Metadata } from "next";

import { RevealController } from "@/components/public/motion/reveal-controller";
import { SiteFooter } from "@/components/public/layout/site-footer";
import { SiteHeader } from "@/components/public/layout/site-header";
import { siteUrl } from "@/content/fixtures/checkpot";

import "./public.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-body",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Checkpot Hietzing",
    template: "%s | Checkpot Hietzing",
  },
  description:
    "Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing. Nachhaltige Kollektionen und ausgewählte Marken.",
  applicationName: "Checkpot Hietzing",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${outfit.variable} public-site`}>
      <RevealController />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
