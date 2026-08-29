import type {
  PublicImage,
  PublicLink,
  SeoRoute,
} from "@/lib/contracts/public";
import { getSiteUrl } from "@/lib/site-config";
import { DEFAULT_STORE_DETAILS } from "@/lib/contracts/store-defaults";

export const siteUrl = getSiteUrl();

export const navigationLinks: PublicLink[] = [
  { href: "/", label: "Startseite" },
  { href: "/mode", label: "Mode" },
  { href: "/outfits", label: "Outfits" },
  { href: "/marken", label: "Marken" },
  { href: "/fair-trade", label: "Fair Trade" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export const storeDetails = DEFAULT_STORE_DETAILS;

export const imagery = {
  hero: {
    src: "/customer/store-christa-counter.jpg",
    alt: "Christa Hausmair im Geschäft Checkpot Hietzing bei der persönlichen Beratung.",
    caption: "Persönliche Beratung in Hietzing",
    objectPosition: "52% 34%",
  },
  founder: {
    src: "/customer/christa-storefront.jpg",
    alt: "Christa Hausmair vor dem Eingang von Checkpot Hietzing.",
    objectPosition: "50% 18%",
  },
  sustainabilityShelf: {
    src: "/customer/store-sustainable-shelf.jpg",
    alt: "Sorgfältig sortierte Kleidung und textile Details im Geschäft von Checkpot.",
    objectPosition: "50% 48%",
  },
  textileDetail: {
    src: "/customer/textile-sorgenfri-detail.jpg",
    alt: "Detailaufnahme eines gemusterten Kleidungsstücks auf einem Bügel.",
    objectPosition: "48% 46%",
  },
  storeDetails: [
    {
      src: "/customer/store-detail-scarves.jpg",
      alt: "Schals und sorgfältig präsentierte Damenmode im Geschäft von Checkpot.",
      objectPosition: "50% 50%",
    },
    {
      src: "/customer/store-detail-flowers.jpg",
      alt: "Ruhige Detailaufnahme aus dem Geschäft mit Blumen und textilen Farben.",
      objectPosition: "50% 50%",
    },
  ] satisfies PublicImage[],
};

export const seoRoutes: SeoRoute[] = [
  {
    route: "/",
    title: "Damenmode & Stilberatung in Wien",
    description:
      "Entdecken Sie hochwertige, feminine Damenmode bei Checkpot Hietzing. Persönliche Beratung und ausgewählte Marken in Wien.",
    canonical: "/",
    index: true,
    socialImage: "/customer/og-image.jpg",
  },
  {
    route: "/ueber-uns",
    title: "Über Checkpot & Christa",
    description:
      "Seit 2009 Ihre Anlaufstelle für persönliche Modeberatung in Hietzing. Lernen Sie Christa Hausmair kennen.",
    canonical: "/ueber-uns",
    index: true,
  },
  {
    route: "/mode",
    title: "Aktuelle Mode & Kollektionen",
    description: "Die neuesten Trends und handverlesene Stücke für diese Saison.",
    canonical: "/mode",
    index: true,
  },
  {
    route: "/outfits",
    title: "Outfit Inspirationen",
    description: "Entdecken Sie komplette Looks und wie neue Stücke perfekt kombiniert werden.",
    canonical: "/outfits",
    index: true,
  },
  {
    route: "/marken",
    title: "Unsere Marken",
    description: "Ausgewählte Modemarken und europäische Modelabels bei Checkpot in Wien Hietzing entdecken.",
    canonical: "/marken",
    index: true,
  },
  {
    route: "/fair-trade",
    title: "Fair Trade & Nachhaltigkeit",
    description: "Unsere Prinzipien für faire, nachhaltige und langlebige Damenmode.",
    canonical: "/fair-trade",
    index: true,
  },
  {
    route: "/kontakt",
    title: "Kontakt & Öffnungszeiten",
    description:
      "Besuchen Sie uns auf der Hietzinger Hauptstraße 10-16. Hier finden Sie alle Kontaktdaten und Öffnungszeiten.",
    canonical: "/kontakt",
    index: true,
  },
  {
    route: "/impressum",
    title: "Impressum",
    description: "Rechtliche Angaben zum Unternehmen Checkpot.",
    canonical: "/impressum",
    index: false,
  },
  {
    route: "/datenschutz",
    title: "Datenschutz",
    description: "Datenschutzerklärung von Checkpot Hietzing.",
    canonical: "/datenschutz",
    index: false,
  },
];
