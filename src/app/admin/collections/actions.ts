"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { collections } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function saveCollectionAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const season = formData.get("season") as string;
  const intro = formData.get("intro") as string;
  const active = formData.get("active") === "true";
  const featured = formData.get("featured") === "true";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  if (!title) {
    throw new Error("Titel ist ein Pflichtfeld.");
  }

  const database = getDatabase();

  const data = {
    title,
    season,
    intro,
    active,
    featured,
    sortOrder,
  };

  if (id && id !== "new") {
    await database.update(collections).set(data).where(eq(collections.id, id));
  } else {
    await database.insert(collections).values(data);
  }

  revalidatePath("/admin/collections");
}

export async function deleteCollectionAction(id: string) {
  await requireAdmin();
  const database = getDatabase();
  await database.delete(collections).where(eq(collections.id, id));
  revalidatePath("/admin/collections");
}
