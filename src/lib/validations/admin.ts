import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich").max(100, "Name zu lang"),
  slug: z.string().trim().min(1, "Slug ist erforderlich").regex(/^[a-z0-9-]+$/, "Slug darf nur aus Kleinbuchstaben, Zahlen und Bindestrichen bestehen").max(100, "Slug zu lang"),
  summary: z.string().trim().max(300, "Zusammenfassung zu lang").nullable().optional().transform(v => v || null),
  description: z.string().trim().max(5000, "Beschreibung zu lang").nullable().optional().transform(v => v || null),
  active: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  logoMediaId: z.string().uuid("Ungültige Logo-ID").nullable().optional().transform(v => v || null),
  imageMediaId: z.string().uuid("Ungültige Bild-ID").nullable().optional().transform(v => v || null),
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
  mediaId: z.string().uuid("Ungültige Media-ID").nullable().optional().transform(v => v || null),
  collectionId: z.string().uuid("Ungültige Kollektions-ID").nullable().optional().transform(v => v || null),
  brandIds: z.array(z.string().uuid("Ungültige Marken-ID")).transform(arr => Array.from(new Set(arr))),
  categoryIds: z.array(z.string().uuid("Ungültige Kategorie-ID")).default([]).transform(arr => Array.from(new Set(arr))),
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
  focalPoint: z.string().regex(/^(?:(?:100|\d{1,2})%\s+(?:100|\d{1,2})%|top|bottom|left|right|center)(?:\s+(?:top|bottom|left|right|center))?$/, "Ungültiger Focal Point").nullable().optional().transform(v => v || null),
  season: z.string().trim().max(50, "Saison zu lang").nullable().optional().transform(v => v || null),
});
