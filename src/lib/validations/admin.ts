import { z } from "zod";

const emptyStringToNull = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? null : val;

const optionalUuid = (errorMessage: string) =>
  z.preprocess(emptyStringToNull, z.string().uuid(errorMessage).nullable().optional()).transform((v) => v ?? null);

export interface BrandSeoMetadata {
  title?: string | null;
  description?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
}

export const brandSeoMetadataSchema = z.object({
  title: z
    .preprocess(emptyStringToNull, z.string().trim().max(70, "SEO-Titel darf maximal 70 Zeichen lang sein").nullable().optional())
    .transform((v) => v ?? null),
  description: z
    .preprocess(emptyStringToNull, z.string().trim().max(180, "Meta-Beschreibung darf maximal 180 Zeichen lang sein").nullable().optional())
    .transform((v) => v ?? null),
  ogTitle: z
    .preprocess(emptyStringToNull, z.string().trim().max(70, "OG-Titel darf maximal 70 Zeichen lang sein").nullable().optional())
    .transform((v) => v ?? null),
  ogDescription: z
    .preprocess(emptyStringToNull, z.string().trim().max(180, "OG-Beschreibung darf maximal 180 Zeichen lang sein").nullable().optional())
    .transform((v) => v ?? null),
});

export const verifiedClaimsSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      return val
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    if (Array.isArray(val)) {
      return val
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return [];
  },
  z
    .array(z.string().max(250, "Ein Hinweis darf maximal 250 Zeichen lang sein"))
    .max(10, "Maximal 10 Hinweise erlaubt")
    .transform((arr) => Array.from(new Set(arr)))
);

export const brandSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich").max(100, "Name zu lang"),
  slug: z.string().trim().min(1, "Slug ist erforderlich").regex(/^[a-z0-9-]+$/, "Slug darf nur aus Kleinbuchstaben, Zahlen und Bindestrichen bestehen").max(100, "Slug zu lang"),
  summary: z.string().trim().max(300, "Zusammenfassung zu lang").nullable().optional().transform(v => v || null),
  description: z.string().trim().max(5000, "Beschreibung zu lang").nullable().optional().transform(v => v || null),
  verifiedClaims: verifiedClaimsSchema.default([]),
  seoMetadata: brandSeoMetadataSchema.nullable().optional().transform(v => v || null),
  active: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  logoMediaId: optionalUuid("Ungültige Logo-ID"),
  imageMediaId: optionalUuid("Ungültige Bild-ID"),
});

export const collectionSchema = z.object({
  title: z.string().trim().min(1, "Titel ist erforderlich").max(100, "Titel zu lang"),
  season: z.string().trim().max(50, "Saison zu lang").nullable().optional().transform(v => v || null),
  intro: z.string().trim().max(1000, "Intro zu lang").nullable().optional().transform(v => v || null),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
});

export const outfitCategoryGroupSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich").max(100, "Name zu lang"),
  slug: z.string().trim().min(1, "Slug ist erforderlich").regex(/^[a-z0-9-]+$/, "Slug darf nur aus Kleinbuchstaben, Zahlen und Bindestrichen bestehen").max(100, "Slug zu lang"),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10000).default(0),
});

export const outfitCategorySchema = z.object({
  groupId: z.string().uuid("Ungültige Gruppen-ID"),
  name: z.string().trim().min(1, "Name ist erforderlich").max(100, "Name zu lang"),
  slug: z.string().trim().min(1, "Slug ist erforderlich").regex(/^[a-z0-9-]+$/, "Slug darf nur aus Kleinbuchstaben, Zahlen und Bindestrichen bestehen").max(100, "Slug zu lang"),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10000).default(0),
});

export const outfitSchema = z.object({
  title: z.string().trim().min(1, "Titel ist erforderlich").max(100, "Titel zu lang"),
  note: z.string().trim().max(300, "Notiz zu lang").nullable().optional().transform(v => v || null),
  availabilityNote: z.string().trim().max(300, "Verfügbarkeitsnotiz zu lang").nullable().optional().transform(v => v || null),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  mediaId: optionalUuid("Ungültige Media-ID"),
  collectionId: optionalUuid("Ungültige Kollektions-ID"),
  brandIds: z.preprocess(
    (val) => (Array.isArray(val) ? val.filter((v) => typeof v === "string" && v.trim() !== "") : []),
    z.array(z.string().uuid("Ungültige Marken-ID")).default([]).transform(arr => Array.from(new Set(arr)))
  ),
  categoryIds: z.preprocess(
    (val) => (Array.isArray(val) ? val.filter((v) => typeof v === "string" && v.trim() !== "") : []),
    z.array(z.string().uuid("Ungültige Kategorie-ID")).default([]).transform(arr => Array.from(new Set(arr)))
  ),
});

export const pageContentSchema = z.object({
  routeKey: z.string().trim().min(1, "RouteKey ist erforderlich").regex(/^[a-z0-9-/]+$/, "Ungültiges Format"),
  content: z.string().trim().transform((val, ctx) => {
    if (!val) return {};
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Inhalt muss ein JSON-Objekt sein" });
        return z.NEVER;
      }
      return parsed;
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ungültiges JSON-Format" });
      return z.NEVER;
    }
  }),
  visibility: z.boolean().default(true),
});

export const mediaMetadataSchema = z.object({
  alt: z.string().trim().max(100, "Alt-Text zu lang").nullable().optional().transform(v => v || null),
  title: z.string().trim().max(100, "Titel zu lang").nullable().optional().transform(v => v || null),
  rights: z.string().trim().max(100, "Rechte-Info zu lang").nullable().optional().transform(v => v || null),
  focalPoint: z.preprocess(
    emptyStringToNull,
    z.string().regex(/^(?:(?:100|\d{1,2})%\s+(?:100|\d{1,2})%|top|bottom|left|right|center)(?:\s+(?:top|bottom|left|right|center))?$/, "Ungültiger Focal Point").nullable().optional()
  ).transform((v) => v ?? null),
  season: z.string().trim().max(50, "Saison zu lang").nullable().optional().transform(v => v || null),
});

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const storeSettingsSchema = z.object({
  name: z.string().trim().min(1, "Geschäftsname ist erforderlich").max(100, "Geschäftsname zu lang"),
  owner: z.string().trim().min(1, "Inhaberin ist erforderlich").max(100, "Name zu lang"),
  street: z.string().trim().min(1, "Straße ist erforderlich").max(150, "Straße zu lang"),
  postalCode: z.string().trim().min(1, "PLZ ist erforderlich").max(20, "PLZ zu lang"),
  city: z.string().trim().min(1, "Ort ist erforderlich").max(100, "Ort zu lang"),
  country: z.string().trim().min(2, "Ungültiges Land").max(10, "Ungültiges Land").default("AT"),
  phone: z.string().trim().min(3, "Telefonnummer ist erforderlich").max(50, "Telefonnummer zu lang"),
  whatsapp: z.string().trim().min(3, "WhatsApp-Nummer ist erforderlich").max(50, "WhatsApp-Nummer zu lang"),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(100, "E-Mail zu lang"),
  hoursMode: z.enum(["compact", "detailed"]).default("compact"),
  hoursNote: z.string().trim().max(300, "Hinweis darf maximal 300 Zeichen lang sein").nullable().optional().transform((v) => v || null),

  // Compact mode fields
  weekdayOpens: z.string().trim().regex(timeRegex, "Format HH:MM (z.B. 09:30)").default("09:30"),
  weekdayCloses: z.string().trim().regex(timeRegex, "Format HH:MM (z.B. 18:00)").default("18:00"),
  weekdayClosed: z.boolean().default(false),
  saturdayOpens: z.string().trim().regex(timeRegex, "Format HH:MM (z.B. 09:30)").default("09:30"),
  saturdayCloses: z.string().trim().regex(timeRegex, "Format HH:MM (z.B. 13:00)").default("13:00"),
  saturdayClosed: z.boolean().default(false),

  // Detailed individual day fields
  mondayOpens: z.string().trim().regex(timeRegex, "Format HH:MM").default("09:30"),
  mondayCloses: z.string().trim().regex(timeRegex, "Format HH:MM").default("18:00"),
  mondayClosed: z.boolean().default(false),

  tuesdayOpens: z.string().trim().regex(timeRegex, "Format HH:MM").default("09:30"),
  tuesdayCloses: z.string().trim().regex(timeRegex, "Format HH:MM").default("18:00"),
  tuesdayClosed: z.boolean().default(false),

  wednesdayOpens: z.string().trim().regex(timeRegex, "Format HH:MM").default("09:30"),
  wednesdayCloses: z.string().trim().regex(timeRegex, "Format HH:MM").default("18:00"),
  wednesdayClosed: z.boolean().default(false),

  thursdayOpens: z.string().trim().regex(timeRegex, "Format HH:MM").default("09:30"),
  thursdayCloses: z.string().trim().regex(timeRegex, "Format HH:MM").default("18:00"),
  thursdayClosed: z.boolean().default(false),

  fridayOpens: z.string().trim().regex(timeRegex, "Format HH:MM").default("09:30"),
  fridayCloses: z.string().trim().regex(timeRegex, "Format HH:MM").default("18:00"),
  fridayClosed: z.boolean().default(false),

  sundayOpens: z.string().trim().regex(timeRegex, "Format HH:MM").default("10:00"),
  sundayCloses: z.string().trim().regex(timeRegex, "Format HH:MM").default("18:00"),
  sundayClosed: z.boolean().default(true),
});

