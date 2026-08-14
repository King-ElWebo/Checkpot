"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { getDatabase } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File;
  const alt = formData.get("alt") as string;
  const title = formData.get("title") as string;
  const rights = formData.get("rights") as string;
  const focalPoint = formData.get("focalPoint") as string;
  const season = formData.get("season") as string;

  if (!file) {
    throw new Error("Keine Datei ausgewählt");
  }

  // Upload to Vercel Blob
  const blob = await put(`media/${file.name}`, file, {
    access: "public",
  });

  // Save to DB
  const database = getDatabase();
  const [newMedia] = await database.insert(media).values({
    url: blob.url,
    alt: alt || null,
    title: title || null,
    rights: rights || null,
    focalPoint: focalPoint || null,
    season: season || null,
  }).returning();

  revalidatePath("/admin/media");
  return { success: true, media: newMedia };
}

export async function deleteMediaAction(id: string, url: string) {
  await requireAdmin();

  // Delete from Vercel Blob
  await del(url);

  // Delete from DB
  const database = getDatabase();
  await database.delete(media).where(eq(media.id, id));

  revalidatePath("/admin/media");
}
