import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfits, outfitBrands, outfitCategoryAssignments } from "@/db/schema";
import crypto from "crypto";

export type OutfitSaveData = {
  title: string;
  note: string | null;
  availabilityNote: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  mediaId: string | null;
  collectionId: string | null;
};

export async function saveOutfitAtomic(
  id: string | null,
  outfitData: OutfitSaveData,
  brandIds: string[],
  categoryIds: string[]
): Promise<string> {
  const database = getDatabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [];
  
  let finalOutfitId = id;

  if (id && id !== "new") {
    queries.push(database.update(outfits).set(outfitData).where(eq(outfits.id, id)));
  } else {
    finalOutfitId = crypto.randomUUID();
    queries.push(database.insert(outfits).values({ id: finalOutfitId, ...outfitData }));
  }

  const outfitIdStr = finalOutfitId as string;

  // Brands
  queries.push(database.delete(outfitBrands).where(eq(outfitBrands.outfitId, outfitIdStr)));
  if (brandIds.length > 0) {
    queries.push(
      database.insert(outfitBrands).values(
        brandIds.map(brandId => ({
          outfitId: outfitIdStr,
          brandId
        }))
      )
    );
  }

  // Categories
  queries.push(database.delete(outfitCategoryAssignments).where(eq(outfitCategoryAssignments.outfitId, outfitIdStr)));
  if (categoryIds.length > 0) {
    queries.push(
      database.insert(outfitCategoryAssignments).values(
        categoryIds.map(categoryId => ({
          outfitId: outfitIdStr,
          categoryId
        }))
      )
    );
  }

  // Execute atomically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await database.batch(queries as any);

  return outfitIdStr;
}
