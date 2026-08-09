import Link from "next/link";

import type { PublicLink } from "@/lib/contracts/public";

type CtaLinkProps = PublicLink & {
  variant?: "primary" | "secondary" | "text";
};

export function CtaLink({ href, label, external = false, variant = "primary" }: CtaLinkProps) {
  const className = `public-cta public-cta-${variant}`;
  const hrefValue = href.toString();

  if (external || !hrefValue.startsWith("/")) {
    return (
      <a className={className} href={hrefValue} rel={hrefValue.startsWith("http") ? "noreferrer" : undefined} target={hrefValue.startsWith("http") ? "_blank" : undefined}>
        {label}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}
