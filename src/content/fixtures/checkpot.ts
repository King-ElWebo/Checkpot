import type {
  Brand,
  CollectionIntro,
  Outfit,
  PublicImage,
  PublicLink,
  SeoRoute,
  StoreDetails,
} from "@/lib/contracts/public";

export const siteUrl = "https://checkpot-hietzing.at";

export const navigationLinks: PublicLink[] = [
  { href: "/", label: "Startseite" },
  { href: "/mode", label: "Mode" },
  { href: "/outfits", label: "Outfits" },
  { href: "/marken", label: "Marken" },
  { href: "/fair-trade", label: "Fair Trade" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export const storeDetails: StoreDetails = {
  name: "Checkpot Hietzing",
  owner: "Christa Hausmair",
  address: {
    street: "Hietzinger Hauptstraße 10-16",
    postalCode: "1130",
    city: "Wien",
    country: "AT",
    display: "Hietzinger Hauptstraße 10-16, 1130 Wien",
  },
  phone: "(01) 877 58 87",
  phoneHref: "tel:+4318775887",
  whatsapp: "0676 3772514",
  whatsappHref: "https://wa.me/436763772514",
  email: "store@checkpot-hietzing.at",
  emailHref: "mailto:store@checkpot-hietzing.at",
  routePlanningHref:
    "https://www.google.com/maps/search/?api=1&query=Hietzinger%20Hauptstra%C3%9Fe%2010-16%2C%201130%20Wien",
  hours: [
    {
      label: "Montag bis Freitag",
      value: "10:00-18:00",
      schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    {
      label: "Samstag",
      value: "10:00-14:00",
      schemaDays: ["Saturday"],
      opens: "10:00",
      closes: "14:00",
    },
  ],
};

export const imagery = {
  hero: {
    src: "/customer/store-christa-counter.jpg",
    alt: "Christa Hausmair im Geschäft Checkpot Hietzing bei der persönlichen Beratung.",
    caption: "Persönliche Beratung in Hietzing",
  },
  founder: {
    src: "/customer/christa-storefront.jpg",
    alt: "Christa Hausmair vor dem Eingang von Checkpot Hietzing.",
  },
  storeDetails: [
    {
      src: "/customer/store-detail-scarves.jpg",
      alt: "Schals und sorgfältig präsentierte Damenmode im Geschäft von Checkpot.",
    },
    {
      src: "/customer/store-detail-flowers.jpg",
      alt: "Ruhige Detailaufnahme aus dem Geschäft mit Blumen und textilen Farben.",
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
    note: "Aktuelle Stücke variieren saisonal im Geschäft.",
    image: { src: "/customer/outfit-summer-pattern.jpg", alt: "Gemusterter Sommerlook aus der aktuellen Checkpot-Auswahl." },
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
    image: { src: "/customer/outfit-blue-summer.jpg", alt: "Blauer Sommerlook auf einer Puppe im Geschäft Checkpot." },
    relatedSlugs: ["adini", "king-louie"],
    active: true,
  },
  {
    name: "Sorgenfri",
    slug: "sorgenfri",
    summary: "Skandinavisch geprägte Mode mit klarer, natürlicher Anmutung.",
    detail:
      "Sorgenfri passt zur hellen, freundlichen Ausrichtung von Checkpot und ergänzt die persönliche Stilberatung um ruhige Lieblingsstücke.",
    note: "Verfügbare Größen und Modelle werden im Geschäft geklärt.",
    image: { src: "/customer/store-detail-flowers.jpg", alt: "Detailaufnahme mit natürlicher, ruhiger Boutique-Stimmung." },
    relatedSlugs: ["happy-rainy-days", "emily-van-den-bergh"],
    active: true,
  },
  {
    name: "King Louie",
    slug: "king-louie",
    summary: "Markante Prints und feminine Schnitte für farbige, komplette Looks.",
    detail:
      "King Louie wird bei Checkpot als Teil einer persönlichen, nicht shopartigen Markenpräsentation gezeigt.",
    note: "Neue Teile werden saisonal kuratiert.",
    image: { src: "/customer/outfit-summer-pattern.jpg", alt: "Farbig gemusterter Look aus der Checkpot-Kollektion." },
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
    image: { src: "/customer/outfit-blue-winter.jpg", alt: "Blauer Herbst-Winter-Look im Geschäft Checkpot." },
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
    image: { src: "/customer/outfit-autumn-layer.jpg", alt: "Herbstlicher Layering-Look im Geschäft Checkpot." },
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
    image: { src: "/customer/store-detail-scarves.jpg", alt: "Boutique-Detail mit Schals und ruhiger Warenpräsentation." },
    relatedSlugs: ["adini", "sorgenfri"],
    active: true,
  },
  {
    name: "Madness",
    slug: "madness",
    summary: "Unkomplizierte Mode für Kundinnen, die Qualität und Alltagstauglichkeit suchen.",
    detail:
      "Madness ergänzt das aktuelle Checkpot-Sortiment um entspannte, tragbare Stücke für viele Gelegenheiten.",
    note: "Aktuelle Verfügbarkeit bitte direkt im Geschäft erfragen.",
    image: { src: "/customer/outfit-blue-winter.jpg", alt: "Ruhiger blauer Outfit-Look in der Checkpot-Boutique." },
    relatedSlugs: ["angels", "happy-rainy-days"],
    active: true,
  },
];

export const outfits: Outfit[] = [
  {
    title: "Blaues Sommerkleid mit leichter Strickjacke",
    note: "Ein ruhiger, frischer Look mit Schal als verbindendem Detail.",
    season: "Frühjahr/Sommer 2026",
    image: { src: "/customer/outfit-blue-summer.jpg", alt: "Blaues Sommerkleid mit hellblauer Strickjacke und Schal bei Checkpot." },
    brandSlugs: ["zilch", "adini"],
    featured: true,
  },
  {
    title: "Gemusterter Sommerlook",
    note: "Farbe und Muster, bewusst weich kombiniert statt laut inszeniert.",
    season: "Frühjahr/Sommer 2026",
    image: { src: "/customer/outfit-summer-pattern.jpg", alt: "Gemusterter Sommerlook aus der Checkpot-Auswahl." },
    brandSlugs: ["adini", "king-louie"],
    featured: true,
  },
  {
    title: "Blauer Layering-Look",
    note: "Warme Schichten mit klarer Silhouette für die kühlere Saison.",
    season: "Herbst/Winter 2025",
    image: { src: "/customer/outfit-blue-winter.jpg", alt: "Blauer Layering-Look auf einer Puppe im Geschäft Checkpot." },
    brandSlugs: ["angels", "madness"],
    featured: true,
  },
  {
    title: "Herbstlicher Kombinationslook",
    note: "Praktische Schichten, abgestimmte Farben und persönliche Passformberatung.",
    season: "Herbst/Winter 2025",
    image: { src: "/customer/outfit-autumn-layer.jpg", alt: "Herbstlicher Kombinationslook in der Checkpot-Boutique." },
    brandSlugs: ["happy-rainy-days", "sorgenfri"],
    featured: true,
  },
];

export const currentCollection: CollectionIntro = {
  title: "Aktuelle Mode & Kollektionen",
  season: "Frühjahr/Sommer 2026",
  intro:
    "Die aktuelle Auswahl zeigt farbige, feminine Stücke und komplette Kombinationen, die im Geschäft persönlich erklärt und angepasst werden.",
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
