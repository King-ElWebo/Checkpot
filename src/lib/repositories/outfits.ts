import { and, asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfits } from "@/db/schema";

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
