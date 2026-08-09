import Image from "next/image";
import Link from "next/link";

import { navigationLinks } from "@/content/fixtures/checkpot";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <Link className="site-logo" href="/" aria-label="Checkpot Hietzing Startseite">
        <Image alt="Checkpot" src="/customer/checkpot-logo.svg" width={176} height={56} />
      </Link>
      <nav aria-label="Hauptnavigation" className="site-nav">
        {navigationLinks.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="site-contact-link" href="/kontakt">
        Geschäft besuchen
      </Link>
    </header>
  );
}
