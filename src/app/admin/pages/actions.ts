"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { pageContent } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function savePageAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const routeKey = formData.get("routeKey") as string;
  const contentString = formData.get("content") as string;
  const visibility = formData.get("visibility") === "true";

  if (!routeKey) {
    throw new Error("Route Key ist ein Pflichtfeld.");
  }

  let content = {};
  try {
    if (contentString) {
      content = JSON.parse(contentString);
    }
  } catch (e) {
    throw new Error("Inhalt muss gültiges JSON sein.");
  }

  const database = getDatabase();

  const data = {
    routeKey,
    content,
    visibility,
  };

  if (id && id !== "new") {
    await database.update(pageContent).set(data).where(eq(pageContent.id, id));
  } else {
    await database.insert(pageContent).values(data);
  }

  revalidatePath("/admin/pages");
}

export async function deletePageAction(id: string) {
  await requireAdmin();
  const database = getDatabase();
  await database.delete(pageContent).where(eq(pageContent.id, id));
  revalidatePath("/admin/pages");
}
