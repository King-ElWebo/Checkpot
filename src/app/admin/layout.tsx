import type { Metadata } from "next";
import Link from "next/link";

import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/admin">
          Checkpot Admin
        </Link>
        <nav aria-label="Admin-Navigation" style={{ flexWrap: "wrap", gap: "6px" }}>
          <Link href="/admin">Übersicht</Link>
          <Link href="/admin/outfits">Outfits</Link>
          <Link href="/admin/brands">Marken</Link>
          <Link href="/admin/collections">Kollektionen</Link>
          <Link href="/admin/outfit-categories">Taxonomie</Link>
          <Link href="/admin/media">Mediathek</Link>
          <Link href="/admin/store">Geschäftsdaten</Link>
          <Link
            href="/admin/pages"
            style={{ opacity: 0.6, fontSize: "0.8rem" }}
            title="Technische Inhaltsblöcke (wird von öffentlichen Seiten nicht verwendet)"
          >
            Seiten (Erweitert)
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className="admin-content">{children}</main>
    </div>
  );
}
