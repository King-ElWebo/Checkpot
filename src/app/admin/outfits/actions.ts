"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfits, outfitBrands } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function saveOutfitAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const note = formData.get("note") as string;
  const availabilityNote = formData.get("availabilityNote") as string;
  const active = formData.get("active") === "true";
  const featured = formData.get("featured") === "true";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  
  const mediaId = formData.get("mediaId") as string;
  const collectionId = formData.get("collectionId") as string;

  if (!title) {
    throw new Error("Titel ist ein Pflichtfeld.");
  }

  const database = getDatabase();

  const data = {
    title,
    note,
    availabilityNote,
    active,
    featured,
    sortOrder,
    mediaId: mediaId || null,
    collectionId: collectionId || null,
  };

  let finalOutfitId = id;

  if (id && id !== "new") {
    await database.update(outfits).set(data).where(eq(outfits.id, id));
  } else {
    const [newOutfit] = await database.insert(outfits).values(data).returning({ id: outfits.id });
    finalOutfitId = newOutfit.id;
  }

  // Handle Brands (Many-to-Many)
  const brandIds = formData.getAll("brandIds") as string[];
  
  if (finalOutfitId) {
    // Delete old mappings
    await database.delete(outfitBrands).where(eq(outfitBrands.outfitId, finalOutfitId));
    
    // Insert new mappings
    if (brandIds.length > 0) {
      await database.insert(outfitBrands).values(
        brandIds.map(brandId => ({
          outfitId: finalOutfitId as string,
          brandId
        }))
      );
    }
  }

  revalidatePath("/admin/outfits");
}

export async function deleteOutfitAction(id: string) {
  await requireAdmin();
  const database = getDatabase();
  // cascade deletion takes care of outfit_brands
  await database.delete(outfits).where(eq(outfits.id, id));
  revalidatePath("/admin/outfits");
}
