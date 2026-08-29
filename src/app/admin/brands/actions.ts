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
  const rawSeoTitle = formData.get("seoTitle");
  const rawSeoDescription = formData.get("seoDescription");
  const rawSeoOgTitle = formData.get("seoOgTitle");
  const rawSeoOgDescription = formData.get("seoOgDescription");

  const hasSeoInput = Boolean(rawSeoTitle || rawSeoDescription || rawSeoOgTitle || rawSeoOgDescription);

  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    verifiedClaims: formData.get("verifiedClaims"),
    seoMetadata: hasSeoInput
      ? {
          title: rawSeoTitle,
          description: rawSeoDescription,
          ogTitle: rawSeoOgTitle,
          ogDescription: rawSeoOgDescription,
        }
      : null,
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
    // Fetch old brand to see if slug changed and preserve any existing custom seoMetadata keys
    const oldBrand = await database.query.brands.findFirst({
      where: eq(brands.id, id),
    });

    if (oldBrand && oldBrand.slug !== data.slug) {
      oldSlug = oldBrand.slug;
    }

    const mergedSeo = oldBrand?.seoMetadata && typeof oldBrand.seoMetadata === "object"
      ? { ...oldBrand.seoMetadata, ...(data.seoMetadata || {}) }
      : data.seoMetadata;

    await database.update(brands).set({
      ...data,
      seoMetadata: mergedSeo,
    }).where(eq(brands.id, id));
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
