import type {
  PublicImage,
  PublicLink,
  SeoRoute,
} from "@/lib/contracts/public";
import { getSiteUrl } from "@/lib/site-config";
import { DEFAULT_STORE_DETAILS, DEFAULT_STORE_SETTINGS_RAW } from "@/lib/contracts/store-defaults";

export const siteUrl = getSiteUrl();

export const navigationLinks: PublicLink[] = [
  { href: "/", label: "Startseite" },
  { href: "/mode", label: "Mode" },
  { href: "/outfits", label: "Outfits" },
  { href: "/marken", label: "Marken" },
  { href: "/fair-trade", label: "Qualität & Herkunft" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export const storeDetails = DEFAULT_STORE_DETAILS;

export const imagery = {
  hero: {
    src: "/customer/christa-boutique-selection.jpg",
    alt: "Christa Hausmair bei der persönlichen Modeberatung im Checkpot Hietzing.",
    caption: "Persönliche Beratung in Hietzing",
    objectPosition: "64% 30%",
  },
  founder: {
    src: "/customer/christa-storefront.jpg",
    alt: "Christa Hausmair vor dem Eingang von Checkpot Hietzing.",
    objectPosition: "50% 18%",
  },
  sustainabilityShelf: {
    src: "/customer/store/20260820_110653.jpg",
    alt: "Ausgewählte Damenmode, Strick und Kleider auf Regalen und Ständern im Geschäft Checkpot in Hietzing.",
    objectPosition: "50% 45%",
  },
  textileDetail: {
    src: "/customer/textile-sorgenfri-detail.jpg",
    alt: "Detailaufnahme eines gemusterten Kleidungsstücks auf einem Bügel.",
    objectPosition: "48% 46%",
  },
  fairTradeConsultation: {
    src: "/customer/christa-boutique-selection.jpg",
    alt: "Christa Hausmair im Geschäft Checkpot vor ausgewählter Damenmode.",
    objectPosition: "62% 28%",
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
    description: "Ausgewählte Modemarken bei Checkpot in Wien Hietzing entdecken.",
    canonical: "/marken",
    index: true,
  },
  {
    route: "/fair-trade",
    title: "Qualität, Herkunft & Transparenz",
    description: "Informationen zu Materialien, Qualität und nachvollziehbaren Markenangaben bei Checkpot Hietzing.",
    canonical: "/fair-trade",
    index: true,
  },
  {
    route: "/kontakt",
    title: "Kontakt & Öffnungszeiten",
    description: `Besuchen Sie uns auf der ${DEFAULT_STORE_SETTINGS_RAW.address.street}. Hier finden Sie alle Kontaktdaten und Öffnungszeiten.`,
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
