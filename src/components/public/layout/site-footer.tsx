import Link from "next/link";

import { navigationLinks, storeDetails } from "@/content/fixtures/checkpot";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="footer-brand">Checkpot Hietzing</p>
          <p>{storeDetails.address.display}</p>
          <p>
            {storeDetails.hours.map((hour) => `${hour.label} ${hour.value}`).join(" · ")}
          </p>
        </div>
        <nav aria-label="Footer Navigation">
          {navigationLinks.slice(0, 5).map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </nav>
      </div>
    </footer>
  );
}
