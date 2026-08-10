"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";

import { navigationLinks } from "@/content/fixtures/checkpot";

export function SiteHeader() {
  const [menuState, setMenuState] = useState({ isOpen: false, pathname: "" });
  const menuId = useId();
  const pathname = usePathname();
  const isOpen = menuState.isOpen && menuState.pathname === pathname;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuState({ isOpen: false, pathname });
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, pathname]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <Link className="site-logo" href="/" aria-label="Checkpot Hietzing Startseite">
        <Image alt="Checkpot" height={48} preload src="/customer/checkpot-logo.svg" unoptimized width={172} />
      </Link>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        className="site-menu-button"
        type="button"
        onClick={() => setMenuState((current) => ({ isOpen: !(current.isOpen && current.pathname === pathname), pathname }))}
      >
        <span aria-hidden="true" />
        Menü
      </button>
      <nav aria-label="Hauptnavigation" className="site-nav" data-open={isOpen} id={menuId}>
        {navigationLinks.map((item) => (
          <Link key={item.label} href={item.href} onClick={() => setMenuState({ isOpen: false, pathname })}>
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
