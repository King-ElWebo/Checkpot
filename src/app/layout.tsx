import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Platform",
    template: "%s | Admin Platform",
  },
  description: "Backend and administration foundation for customer projects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-AT" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
