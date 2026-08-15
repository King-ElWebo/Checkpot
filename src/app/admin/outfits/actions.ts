"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfits, outfitBrands, brands } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

import { outfitSchema } from "@/lib/validations/admin";
import crypto from "crypto";

export async function saveOutfitAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const parsed = outfitSchema.safeParse({
    title: formData.get("title"),
    note: formData.get("note"),
    availabilityNote: formData.get("availabilityNote"),
    active: formData.get("active") === "true",
    featured: formData.get("featured") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    mediaId: formData.get("mediaId"),
    collectionId: formData.get("collectionId"),
    brandIds: formData.getAll("brandIds"),
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e: { message: string }) => e.message).join(", ")}`);
  }

  const data = parsed.data;
  const brandIds = data.brandIds;
  const outfitData = {
    title: data.title,
    note: data.note,
    availabilityNote: data.availabilityNote,
    active: data.active,
    featured: data.featured,
    sortOrder: data.sortOrder,
    mediaId: data.mediaId,
    collectionId: data.collectionId,
  };

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

  if (finalOutfitId) {
    queries.push(database.delete(outfitBrands).where(eq(outfitBrands.outfitId, finalOutfitId)));
    if (brandIds.length > 0) {
      queries.push(
        database.insert(outfitBrands).values(
          brandIds.map(brandId => ({
            outfitId: finalOutfitId as string,
            brandId
          }))
        )
      );
    }
  }

  // Execute atomically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await database.batch(queries as any);

  // Revalidate public routes
  revalidatePath("/admin/outfits");
  revalidatePath("/outfits");
  revalidatePath("/");
  revalidatePath("/mode");
  
  // Revalidate related brand detail pages
  for (const brandId of brandIds) {
    const brand = await database.query.brands.findFirst({
      where: eq(brands.id, brandId),
      columns: { slug: true }
    });
    if (brand) {
      revalidatePath(`/marken/${brand.slug}`, "page");
    }
  }
}

export async function deleteOutfitAction(id: string) {
  await requireAdmin();
  const database = getDatabase();

  const oldMappings = await database.query.outfitBrands.findMany({
    where: eq(outfitBrands.outfitId, id),
    with: { brand: { columns: { slug: true } } }
  });

  // cascade deletion takes care of outfit_brands
  await database.delete(outfits).where(eq(outfits.id, id));
  
  revalidatePath("/admin/outfits");
  revalidatePath("/outfits");
  revalidatePath("/");
  revalidatePath("/mode");
  
  for (const mapping of oldMappings) {
    if (mapping.brand) {
      revalidatePath(`/marken/${mapping.brand.slug}`, "page");
    }
  }
}
