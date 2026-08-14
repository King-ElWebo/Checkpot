import { and, asc, eq, inArray } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfits, outfitBrands } from "@/db/schema";

export async function listPublishedOutfits() {
  const db = getDatabase();
  return db.query.outfits.findMany({
    where: eq(outfits.active, true),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
      collection: true,
      outfitBrands: {
        with: {
          brand: true,
        }
      }
    },
  });
}

export async function listFeaturedOutfits() {
  const db = getDatabase();
  return db.query.outfits.findMany({
    where: and(eq(outfits.featured, true), eq(outfits.active, true)),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
    },
  });
}

export async function getOutfitsByBrandId(brandId: string) {
  const db = getDatabase();
  
  const brandOutfits = await db.query.outfitBrands.findMany({
    where: eq(outfitBrands.brandId, brandId),
    columns: { outfitId: true },
  });
  
  if (brandOutfits.length === 0) return [];
  
  return db.query.outfits.findMany({
    where: and(
      eq(outfits.active, true),
      inArray(outfits.id, brandOutfits.map((bo) => bo.outfitId))
    ),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
    },
  });
}
