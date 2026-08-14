import { relations } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const systemSettings = pgTable(
  "system_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull().unique(),
    value: jsonb("value").$type<unknown>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("system_settings_key_idx").on(table.key)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    actor: text("actor").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("audit_logs_created_at_idx").on(table.createdAt)],
);

// ----------------------------------------------------------------------
// Checkpot Domain Models
// ----------------------------------------------------------------------

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  alt: text("alt"),
  title: text("title"),
  rights: text("rights"),
  focalPoint: text("focal_point"), // e.g., "50% 50%"
  season: text("season"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  description: text("description"),
  verifiedClaims: jsonb("verified_claims").$type<string[]>(),
  active: boolean("active").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  logoMediaId: uuid("logo_media_id").references(() => media.id, { onDelete: "set null" }),
  imageMediaId: uuid("image_media_id").references(() => media.id, { onDelete: "set null" }),
  seoMetadata: jsonb("seo_metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("brands_slug_idx").on(table.slug),
  index("brands_active_idx").on(table.active)
]);

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  season: text("season"), // e.g., "Frühjahr/Sommer 2026"
  intro: text("intro"),
  active: boolean("active").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const outfits = pgTable("outfits", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  note: text("note"),
  availabilityNote: text("availability_note"),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "set null" }),
  seoMetadata: jsonb("seo_metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const outfitBrands = pgTable("outfit_brands", {
  outfitId: uuid("outfit_id").notNull().references(() => outfits.id, { onDelete: "cascade" }),
  brandId: uuid("brand_id").notNull().references(() => brands.id, { onDelete: "cascade" }),
}, (table) => [
  index("outfit_brands_outfit_id_idx").on(table.outfitId),
  index("outfit_brands_brand_id_idx").on(table.brandId)
]);

export const pageContent = pgTable("page_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  routeKey: text("route_key").notNull().unique(), // e.g., "home", "ueber-uns"
  content: jsonb("content").$type<Record<string, unknown>>().notNull(), // structured blocks
  visibility: boolean("visibility").default(true).notNull(),
  seoMetadata: jsonb("seo_metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const brandsRelations = relations(brands, ({ one, many }) => ({
  logo: one(media, { fields: [brands.logoMediaId], references: [media.id] }),
  image: one(media, { fields: [brands.imageMediaId], references: [media.id] }),
  outfitBrands: many(outfitBrands),
}));

export const outfitsRelations = relations(outfits, ({ one, many }) => ({
  media: one(media, { fields: [outfits.mediaId], references: [media.id] }),
  collection: one(collections, { fields: [outfits.collectionId], references: [collections.id] }),
  outfitBrands: many(outfitBrands),
}));

export const outfitBrandsRelations = relations(outfitBrands, ({ one }) => ({
  outfit: one(outfits, { fields: [outfitBrands.outfitId], references: [outfits.id] }),
  brand: one(brands, { fields: [outfitBrands.brandId], references: [brands.id] }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  outfits: many(outfits),
}));
