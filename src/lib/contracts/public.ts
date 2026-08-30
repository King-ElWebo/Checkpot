import type { Route } from "next";

export type PublicRoute =
  | "/"
  | "/ueber-uns"
  | "/mode"
  | "/outfits"
  | "/marken"
  | `/marken/${string}`
  | "/fair-trade"
  | "/kontakt"
  | "/impressum"
  | "/datenschutz";

export type PublicImage = {
  src: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
};

export type PublicLink = {
  href: Route | string;
  label: string;
  external?: boolean;
};

export type StoreHours = {
  label: string;
  value: string;
  schemaDays?: string[];
  opens?: string;
  closes?: string;
};

export type StoreDetails = {
  name: string;
  owner: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    display: string;
  };
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  email: string;
  emailHref: string;
  routePlanningHref: string;
  hours: StoreHours[];
  hoursNote?: string;
};

export type Brand = {
  name: string;
  slug: string;
  summary: string;
  detail: string;
  note: string;
  image: PublicImage;
  relatedSlugs: string[];
  active: boolean;
};

export type Outfit = {
  title: string;
  note: string;
  season: string;
  image: PublicImage;
  brandSlugs: string[];
  featured: boolean;
};

export type CollectionIntro = {
  title: string;
  season: string;
  intro: string;
  images: PublicImage[];
};

export type BreadcrumbItem = {
  label: string;
  href: PublicRoute;
};

export type SeoRoute = {
  route: PublicRoute;
  title: string;
  description: string;
  canonical: PublicRoute;
  index: boolean;
  socialImage?: string;
};

export type ContactFormState = "idle" | "submitting" | "success" | "validation-error" | "server-error";

export type ContactFormPayload = {
  name: string;
  surname: string;
  email: string;
  message: string;
};
