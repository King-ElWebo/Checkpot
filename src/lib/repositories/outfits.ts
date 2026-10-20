import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db";
import { outfits, outfitBrands } from "@/db/schema";
import { getOrSetCached, invalidateCache } from "@/lib/cache";

const OUTFITS_CACHE_PREFIX = "outfits";
const OUTFITS_PUBLISHED_KEY = "outfits:published";
const OUTFITS_HOMEPAGE_KEY = "outfits:homepage";
const OUTFITS_TTL_SECONDS = 120; // 2 minutes

export function invalidateOutfitsCache() {
  invalidateCache(OUTFITS_CACHE_PREFIX);
}

export async function listPublishedOutfits() {
  if (!isDatabaseConfigured()) return [];

  return await getOrSetCached(
    OUTFITS_PUBLISHED_KEY,
    async () => {
      const db = getDatabase();
      const rows = await db.query.outfits.findMany({
        where: eq(outfits.active, true),
        orderBy: [asc(outfits.sortOrder)],
        with: {
          media: true,
          collection: true,
          outfitBrands: {
            with: {
              brand: true,
            },
          },
          outfitCategoryAssignments: {
            with: {
              category: {
                with: {
                  group: true,
                },
              },
            },
          },
        },
      });

      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        note: row.note,
        availabilityNote: row.availabilityNote,
        media: row.media,
        collection: row.collection,
        brands: row.outfitBrands
          .filter((ob) => ob.brand && ob.brand.active)
          .map((ob) => ({
            id: ob.brand.id,
            name: ob.brand.name,
            slug: ob.brand.slug,
          })),
        categories: row.outfitCategoryAssignments
          .filter(
            (oca) =>
              oca.category && oca.category.active && oca.category.group.active
          )
          .map((oca) => ({
            id: oca.category.id,
            slug: oca.category.slug,
            name: oca.category.name,
            groupId: oca.category.group.id,
            groupSlug: oca.category.group.slug,
          })),
      }));
    },
    OUTFITS_TTL_SECONDS
  );
}

export async function listFeaturedOutfits() {
  if (!isDatabaseConfigured()) return [];
  const db = getDatabase();
  return db.query.outfits.findMany({
    where: and(eq(outfits.featured, true), eq(outfits.active, true)),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
    },
  });
}

export async function listHomepageOutfits(limit = 10) {
  if (!isDatabaseConfigured()) return [];

  return await getOrSetCached(
    `${OUTFITS_HOMEPAGE_KEY}:${limit}`,
    async () => {
      const db = getDatabase();
      return db.query.outfits.findMany({
        where: eq(outfits.active, true),
        orderBy: [desc(outfits.featured), asc(outfits.sortOrder)],
        limit,
        with: {
          media: true,
        },
      });
    },
    OUTFITS_TTL_SECONDS
  );
}

export async function getOutfitsByBrandId(brandId: string) {
  if (!isDatabaseConfigured()) return [];

  return await getOrSetCached(
    `outfits:brand:${brandId}`,
    async () => {
      const db = getDatabase();
      const brandOutfits = await db.query.outfitBrands.findMany({
        where: eq(outfitBrands.brandId, brandId),
        columns: { outfitId: true },
      });

      if (brandOutfits.length === 0) return [];

      return db.query.outfits.findMany({
        where: and(
          eq(outfits.active, true),
          inArray(
            outfits.id,
            brandOutfits.map((bo) => bo.outfitId)
          )
        ),
        orderBy: [asc(outfits.sortOrder)],
        with: {
          media: true,
        },
      });
    },
    OUTFITS_TTL_SECONDS
  );
}
