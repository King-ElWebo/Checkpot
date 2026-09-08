import type { Metadata } from "next";

import "./globals.css";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Checkpot Damenmoden Wien-Hietzing",
    template: "%s | Checkpot Hietzing",
  },
  description:
    "Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing. Nachhaltige Kollektionen und ausgewählte Marken.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-AT" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
