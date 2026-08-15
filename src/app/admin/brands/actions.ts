"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

import { brandSchema } from "@/lib/validations/admin";

export async function saveBrandAction(id: string | null, formData: FormData) {
  await requireAdmin();

  // Validate input
  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    active: formData.get("active") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    logoMediaId: formData.get("logoMediaId"),
    imageMediaId: formData.get("imageMediaId"),
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e: { message: string }) => e.message).join(", ")}`);
  }

  const data = parsed.data;
  const database = getDatabase();

  let oldSlug: string | undefined;

  if (id && id !== "new") {
    // Fetch old brand to see if slug changed
    const oldBrand = await database.query.brands.findFirst({
      where: eq(brands.id, id),
      columns: { slug: true }
    });
    if (oldBrand && oldBrand.slug !== data.slug) {
      oldSlug = oldBrand.slug;
    }
    
    await database.update(brands).set(data).where(eq(brands.id, id));
  } else {
    await database.insert(brands).values(data);
  }

  // Revalidations
  revalidatePath("/admin/brands");
  revalidatePath("/marken");
  revalidatePath(`/marken/${data.slug}`, "page");
  if (oldSlug) {
    revalidatePath(`/marken/${oldSlug}`, "page");
  }
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function deleteBrandAction(id: string) {
  await requireAdmin();
  const database = getDatabase();

  const brand = await database.query.brands.findFirst({
    where: eq(brands.id, id),
    columns: { slug: true }
  });

  await database.delete(brands).where(eq(brands.id, id));
  
  revalidatePath("/admin/brands");
  revalidatePath("/marken");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (brand) {
    revalidatePath(`/marken/${brand.slug}`, "page");
  }
}
