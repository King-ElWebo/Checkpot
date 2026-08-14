"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function saveBrandAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const active = formData.get("active") === "true";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  
  const logoMediaId = formData.get("logoMediaId") as string;
  const imageMediaId = formData.get("imageMediaId") as string;

  if (!name || !slug) {
    throw new Error("Name und Slug sind Pflichtfelder.");
  }

  const database = getDatabase();

  const data = {
    name,
    slug,
    summary,
    description,
    active,
    sortOrder,
    logoMediaId: logoMediaId || null,
    imageMediaId: imageMediaId || null,
  };

  if (id && id !== "new") {
    await database.update(brands).set(data).where(eq(brands.id, id));
  } else {
    await database.insert(brands).values(data);
  }

  revalidatePath("/admin/brands");
}

export async function deleteBrandAction(id: string) {
  await requireAdmin();
  const database = getDatabase();
  await database.delete(brands).where(eq(brands.id, id));
  revalidatePath("/admin/brands");
}
