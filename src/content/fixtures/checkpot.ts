import type {
  Brand,
  CollectionIntro,
  Outfit,
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

export const brands: Brand[] = [
  {
    name: "Adini",
    slug: "adini",
    summary: "Feminine Muster, weiche Stoffe und unkomplizierte Kleider für Alltag und Anlass.",
    detail:
      "Adini steht bei Checkpot für tragbare, farbige Kollektionen mit ruhiger Passform und vielen Kombinationsmöglichkeiten.",
    note: "Christa zeigt im Geschäft, welche Farben und Schnitte zur Trägerin passen.",
    image: { src: "/customer/outfit-summer-pattern.jpg", alt: "Gemusterter Sommerlook aus der aktuellen Checkpot-Auswahl.", objectPosition: "50% 18%" },
    relatedSlugs: ["king-louie", "zilch"],
    active: true,
  },
  {
    name: "Zilch",
    slug: "zilch",
    summary: "Ausdrucksstarke Farben und Muster für Kundinnen, die gerne sichtbar kombinieren.",
    detail:
      "Die Auswahl zeigt den farbigen, kreativen Teil des Checkpot-Sortiments, ohne den ruhigen Boutique-Charakter zu verlieren.",
    note: "Im Geschäft berät Christa zu passenden Kombinationen.",
    image: { src: "/customer/outfit-blue-summer.jpg", alt: "Blauer Sommerlook auf einer Puppe im Geschäft Checkpot.", objectPosition: "50% 18%" },
    relatedSlugs: ["adini", "king-louie"],
    active: true,
  },
  {
    name: "Sorgenfri",
    slug: "sorgenfri",
    summary: "Skandinavisch geprägte Mode mit klarer, natürlicher Anmutung.",
    detail:
      "Sorgenfri passt zur hellen, freundlichen Ausrichtung von Checkpot und ergänzt die persönliche Stilberatung um ruhige Lieblingsstücke.",
    note: "Die Auswahl wird persönlich und saisonal zusammengestellt.",
    image: { src: "/customer/textile-sorgenfri-detail.jpg", alt: "Textiles Detail eines gemusterten Sorgenfri-Kleidungsstücks.", objectPosition: "48% 46%" },
    relatedSlugs: ["happy-rainy-days", "emily-van-den-bergh"],
    active: true,
  },
  {
    name: "King Louie",
    slug: "king-louie",
    summary: "Markante Prints und feminine Schnitte für farbige, komplette Looks.",
    detail:
      "King Louie ergänzt bei Checkpot die farbige, feminine Seite der Auswahl mit markanten Prints und tragbaren Schnitten.",
    note: "Neue Teile werden saisonal kuratiert.",
    image: { src: "/customer/outfit-summer-pattern.jpg", alt: "Farbig gemusterter Look aus der Checkpot-Kollektion.", objectPosition: "50% 18%" },
    relatedSlugs: ["adini", "zilch"],
    active: true,
  },
  {
    name: "Angels",
    slug: "angels",
    summary: "Hosen und Kombiteile für alltagstaugliche, hochwertige Damenmode.",
    detail:
      "Angels ergänzt im Sortiment die stärker gemusterten Marken durch ruhige Basics und tragbare Kombinationsstücke.",
    note: "Passformen werden persönlich im Geschäft beraten.",
    image: { src: "/customer/outfit-blue-winter.jpg", alt: "Blauer Herbst-Winter-Look im Geschäft Checkpot.", objectPosition: "50% 18%" },
    relatedSlugs: ["madness", "emily-van-den-bergh"],
    active: true,
  },
  {
    name: "Happy Rainy Days",
    slug: "happy-rainy-days",
    summary: "Praktische Regenmode für einen gepflegten Alltag bei wechselhaftem Wetter.",
    detail:
      "Die Marke ergänzt das Sortiment um funktionale Stücke, die zur persönlichen Beratung und zum Alltag in Wien passen.",
    note: "Die aktuelle Auswahl ist saisonabhängig.",
    image: { src: "/customer/outfit-autumn-layer.jpg", alt: "Herbstlicher Layering-Look im Geschäft Checkpot.", objectPosition: "50% 18%" },
    relatedSlugs: ["sorgenfri", "angels"],
    active: true,
  },
  {
    name: "Emily van den Bergh",
    slug: "emily-van-den-bergh",
    summary: "Blusen, Kleider und feine Muster mit freundlicher, femininer Wirkung.",
    detail:
      "Bei Checkpot wird die Marke als Teil ausgewählter, gut kombinierbarer Kollektionen präsentiert.",
    note: "Christa berät zu Farben, Proportionen und Anlässen.",
    image: { src: "/customer/store-detail-scarves.jpg", alt: "Boutique-Detail mit Schals und ruhiger Warenpräsentation.", objectPosition: "50% 50%" },
    relatedSlugs: ["adini", "sorgenfri"],
    active: true,
  },
  {
    name: "Madness",
    slug: "madness",
    summary: "Unkomplizierte Mode für Kundinnen, die Qualität und Alltagstauglichkeit suchen.",
    detail:
      "Madness ergänzt das aktuelle Checkpot-Sortiment um entspannte, tragbare Stücke für viele Gelegenheiten.",
    note: "Christa hilft beim Kombinieren mit vorhandenen Lieblingsstücken.",
    image: { src: "/customer/outfit-blue-winter.jpg", alt: "Ruhiger blauer Outfit-Look in der Checkpot-Boutique.", objectPosition: "50% 18%" },
    relatedSlugs: ["angels", "happy-rainy-days"],
    active: true,
  },
];

export const outfits: Outfit[] = [
  {
    title: "Blaues Sommerkleid mit leichter Strickjacke",
    note: "Ein ruhiger, frischer Look mit Schal als verbindendem Detail.",
    season: "Frühjahr/Sommer 2026",
    image: { src: "/customer/outfit-blue-summer.jpg", alt: "Blaues Sommerkleid mit hellblauer Strickjacke und Schal bei Checkpot.", objectPosition: "50% 14%" },
    brandSlugs: ["zilch", "adini"],
    featured: true,
  },
  {
    title: "Gemusterter Sommerlook",
    note: "Farbe und Muster, bewusst weich kombiniert statt laut inszeniert.",
    season: "Frühjahr/Sommer 2026",
    image: { src: "/customer/outfit-summer-pattern.jpg", alt: "Gemusterter Sommerlook aus der Checkpot-Auswahl.", objectPosition: "50% 16%" },
    brandSlugs: ["adini", "king-louie"],
    featured: true,
  },
  {
    title: "Blauer Layering-Look",
    note: "Warme Schichten mit klarer Silhouette für die kühlere Saison.",
    season: "Herbst/Winter 2025",
    image: { src: "/customer/outfit-blue-winter.jpg", alt: "Blauer Layering-Look auf einer Puppe im Geschäft Checkpot.", objectPosition: "50% 15%" },
    brandSlugs: ["angels", "madness"],
    featured: true,
  },
  {
    title: "Herbstlicher Kombinationslook",
    note: "Praktische Schichten, abgestimmte Farben und persönliche Passformberatung.",
    season: "Herbst/Winter 2025",
    image: { src: "/customer/outfit-autumn-layer.jpg", alt: "Herbstlicher Kombinationslook in der Checkpot-Boutique.", objectPosition: "50% 16%" },
    brandSlugs: ["happy-rainy-days", "sorgenfri"],
    featured: true,
  },
];

export const currentCollection: CollectionIntro = {
  title: "Aktuelle Mode & Kollektionen",
  season: "Frühjahr/Sommer 2026",
  intro:
    "Die aktuelle Auswahl zeigt farbige, feminine Stücke, weiche Materialien und komplette Kombinationen für die Beratung im Geschäft.",
  images: outfits.slice(0, 3).map((outfit) => outfit.image),
};

export const seoRoutes: SeoRoute[] = [
  {
    route: "/",
    title: "Damenmode & Stilberatung in Wien",
    description:
      "Entdecken Sie hochwertige, feminine Damenmode bei Checkpot Hietzing. Persönliche Beratung und nachhaltige Marken in Wien.",
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
    description: "Ausgewählte, faire und nachhaltige Modemarken bei Checkpot Hietzing.",
    canonical: "/marken",
    index: true,
  },
  {
    route: "/fair-trade",
    title: "Fair Trade & Nachhaltigkeit",
    description: "Unsere Prinzipien für faire, nachhaltige und ökologische Damenmode.",
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

export function getBrandBySlug(slug: string) {
  return brands.find((brand) => brand.slug === slug && brand.active);
}

export function getRelatedBrands(brand: Brand) {
  return brand.relatedSlugs
    .map((slug) => getBrandBySlug(slug))
    .filter((related): related is Brand => Boolean(related));
}
