"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { collections } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

import { collectionSchema } from "@/lib/validations/admin";

export async function saveCollectionAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const parsed = collectionSchema.safeParse({
    title: formData.get("title"),
    season: formData.get("season"),
    intro: formData.get("intro"),
    active: formData.get("active") === "true",
    featured: formData.get("featured") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e: { message: string }) => e.message).join(", ")}`);
  }

  const data = parsed.data;
  const database = getDatabase();

  if (id && id !== "new") {
    await database.update(collections).set(data).where(eq(collections.id, id));
  } else {
    await database.insert(collections).values(data);
  }

  revalidatePath("/admin/collections");
  revalidatePath("/mode");
  revalidatePath("/");
  revalidatePath("/outfits");
}

export async function deleteCollectionAction(id: string) {
  await requireAdmin();
  const database = getDatabase();
  await database.delete(collections).where(eq(collections.id, id));
  
  revalidatePath("/admin/collections");
  revalidatePath("/mode");
  revalidatePath("/");
  revalidatePath("/outfits");
}
