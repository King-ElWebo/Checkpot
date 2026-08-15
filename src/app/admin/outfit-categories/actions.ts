"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfitCategoryGroups, outfitCategories, outfitCategoryAssignments } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { outfitCategoryGroupSchema, outfitCategorySchema } from "@/lib/validations/admin";
import crypto from "crypto";

export async function saveGroupAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const parsed = outfitCategoryGroupSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    active: formData.get("active") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }

  const database = getDatabase();
  const data = parsed.data;

  // Check unique slug
  const existing = await database.query.outfitCategoryGroups.findFirst({
    where: eq(outfitCategoryGroups.slug, data.slug)
  });
  if (existing && existing.id !== id) {
    throw new Error("Slug existiert bereits.");
  }

  if (id && id !== "new") {
    await database.update(outfitCategoryGroups).set(data).where(eq(outfitCategoryGroups.id, id));
  } else {
    await database.insert(outfitCategoryGroups).values({ id: crypto.randomUUID(), ...data });
  }

  revalidatePath("/admin/outfit-categories");
  revalidatePath("/outfits");
}

export async function deleteGroupAction(id: string) {
  await requireAdmin();
  const database = getDatabase();
  
  // Prevent deletion if child categories exist to be safe
  const children = await database.query.outfitCategories.findFirst({
    where: eq(outfitCategories.groupId, id)
  });
  if (children) {
    throw new Error("Gruppe kann nicht gelöscht werden, da sie noch Kategorien enthält. Bitte diese zuerst löschen oder die Gruppe deaktivieren.");
  }

  await database.delete(outfitCategoryGroups).where(eq(outfitCategoryGroups.id, id));
  revalidatePath("/admin/outfit-categories");
  revalidatePath("/outfits");
}

export async function saveCategoryAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const parsed = outfitCategorySchema.safeParse({
    groupId: formData.get("groupId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    active: formData.get("active") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }

  const database = getDatabase();
  const data = parsed.data;

  // Check unique slug within group
  const existing = await database.query.outfitCategories.findFirst({
    where: and(
      eq(outfitCategories.groupId, data.groupId),
      eq(outfitCategories.slug, data.slug)
    )
  });
  if (existing && existing.id !== id) {
    throw new Error("Slug existiert in dieser Gruppe bereits.");
  }

  if (id && id !== "new") {
    await database.update(outfitCategories).set(data).where(eq(outfitCategories.id, id));
  } else {
    await database.insert(outfitCategories).values({ id: crypto.randomUUID(), ...data });
  }

  revalidatePath("/admin/outfit-categories");
  revalidatePath("/outfits");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const database = getDatabase();

  const assignments = await database.query.outfitCategoryAssignments.findFirst({
    where: eq(outfitCategoryAssignments.categoryId, id)
  });
  
  if (assignments) {
    throw new Error("Kategorie kann nicht gelöscht werden, da sie noch Outfits zugewiesen ist. Bitte zuerst bei den Outfits entfernen oder deaktivieren.");
  }

  await database.delete(outfitCategories).where(eq(outfitCategories.id, id));
  revalidatePath("/admin/outfit-categories");
  revalidatePath("/outfits");
}
