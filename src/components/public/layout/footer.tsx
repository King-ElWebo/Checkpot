import Link from "next/link";
import { storeDetails } from "@/content/fixtures/checkpot";

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#F9F9F8]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.08em] font-medium text-[#1A1A1A]">
              {storeDetails.name}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[#4A5568]">
              {storeDetails.address.street}
              <br />
              {storeDetails.address.postalCode} {storeDetails.address.city}
              <br />
              Österreich
            </p>
          </div>
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.08em] font-medium text-[#1A1A1A]">Kontakt</h3>
            <p className="mt-4 text-sm leading-6 text-[#4A5568]">
              Tel:{" "}
              <a href={storeDetails.phoneHref} className="hover:text-[#C01718]">
                {storeDetails.phone}
              </a>
              <br />
              WhatsApp:{" "}
              <a href={storeDetails.whatsappHref} className="hover:text-[#C01718]">
                {storeDetails.whatsapp}
              </a>
              <br />
              E-Mail:{" "}
              <a href={storeDetails.emailHref} className="hover:text-[#C01718]">
                {storeDetails.email}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.08em] font-medium text-[#1A1A1A]">Informationen</h3>
            <ul className="mt-4 flex flex-col space-y-2 text-sm text-[#4A5568]">
              <li>
                <Link href="/kontakt" className="hover:text-[#C01718]">
                  Kontakt & Öffnungszeiten
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-[#C01718]">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-[#C01718]">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#E2E8F0] pt-8">
          <p className="text-xs text-[#4A5568]">
            &copy; {new Date().getFullYear()} {storeDetails.name}. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
