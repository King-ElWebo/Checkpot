"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { getDatabase } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getMediaUsage, MediaDto } from "@/lib/repositories/media";
import { mediaMetadataSchema } from "@/lib/validations/admin";
import crypto from "crypto";

// Helper function to check magic numbers
async function verifyImageFile(file: File): Promise<string | null> {
  const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const header = arr.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

  if (header.startsWith("89504e47")) return "png";
  if (header.startsWith("ffd8ff")) return "jpg";
  if (header.startsWith("52494646") && arr.length >= 4) {
    // Check for WEBP (RIFF .... WEBP)
    const arr12 = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const webpHeader = arr12.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
    if (webpHeader.endsWith("57454250")) return "webp";
  }
  return null;
}

export async function uploadMediaAction(formData: FormData): Promise<{ success: boolean; media: MediaDto }> {
  await requireAdmin();

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("Keine Datei ausgewählt");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Die Datei überschreitet das Limit von 5MB.");
  }

  const ext = await verifyImageFile(file);
  if (!ext) {
    throw new Error("Ungültiges Dateiformat. Nur JPG, PNG und WEBP sind erlaubt.");
  }

  const parsed = mediaMetadataSchema.safeParse({
    alt: formData.get("alt"),
    title: formData.get("title"),
    rights: formData.get("rights"),
    focalPoint: formData.get("focalPoint"),
    season: formData.get("season"),
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }

  const data = parsed.data;
  const originalName = file.name;
  const secureFilename = `${crypto.randomUUID()}.${ext}`;

  // Upload to Vercel Blob
  const blob = await put(`media/${secureFilename}`, file, {
    access: "public",
  });

  // Save to DB
  const database = getDatabase();
  const [newMedia] = await database.insert(media).values({
    url: blob.url,
    alt: data.alt || null,
    title: data.title || originalName, // store original filename in title if empty
    rights: data.rights || null,
    focalPoint: data.focalPoint || null,
    season: data.season || null,
  }).returning();

  revalidatePath("/admin/media");
  return {
    success: true,
    media: {
      id: newMedia.id,
      url: newMedia.url,
      title: newMedia.title,
      alt: newMedia.alt,
      rights: newMedia.rights,
      focalPoint: newMedia.focalPoint,
      season: newMedia.season,
      createdAt: newMedia.createdAt,
    },
  };
}

export async function updateMediaMetadataAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = mediaMetadataSchema.safeParse({
    alt: formData.get("alt"),
    title: formData.get("title"),
    rights: formData.get("rights"),
    focalPoint: formData.get("focalPoint"),
    season: formData.get("season"),
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }

  const data = parsed.data;
  const database = getDatabase();

  const [updated] = await database
    .update(media)
    .set({
      alt: data.alt || null,
      title: data.title || null,
      rights: data.rights || null,
      focalPoint: data.focalPoint || null,
      season: data.season || null,
    })
    .where(eq(media.id, id))
    .returning();

  if (!updated) {
    throw new Error("Medium nicht gefunden.");
  }

  // Revalidate affected views
  revalidatePath("/admin/media");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/outfits");
  revalidatePath("/");
  revalidatePath("/marken");
  revalidatePath("/outfits");
  revalidatePath("/mode");

  return { success: true, media: updated };
}

export async function checkMediaUsageAction(id: string) {
  await requireAdmin();
  return getMediaUsage(id);
}

export async function deleteMediaAction(id: string, force = false) {
  await requireAdmin();

  const database = getDatabase();

  const dbMedia = await database.query.media.findFirst({
    where: eq(media.id, id),
  });

  if (!dbMedia) {
    throw new Error("Medium nicht in der Datenbank gefunden.");
  }

  // Check usage
  const usage = await getMediaUsage(id);
  if (usage.totalCount > 0 && !force) {
    throw new Error(
      `Dieses Bild wird derzeit bei ${usage.totalCount} Element(en) verwendet und kann nur mit expliziter Bestätigung gelöscht werden.`
    );
  }

  // Find related entities to revalidate before deleting
  const relatedBrands = await database.query.brands.findMany({
    where: (b, { eq, or }) => or(eq(b.logoMediaId, id), eq(b.imageMediaId, id)),
    columns: { slug: true },
  });

  // Delete from Vercel Blob
  try {
    await del(dbMedia.url);
  } catch (err) {
    console.error("Vercel Blob deletion error:", err);
  }

  // Delete from DB
  await database.delete(media).where(eq(media.id, id));

  revalidatePath("/admin/media");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/outfits");

  // Revalidate public routes
  if (relatedBrands.length > 0 || usage.outfits.length > 0) {
    revalidatePath("/");
    revalidatePath("/marken");
    revalidatePath("/outfits");
    revalidatePath("/mode");
  }

  for (const b of relatedBrands) {
    revalidatePath(`/marken/${b.slug}`, "page");
  }

  return { success: true };
}
