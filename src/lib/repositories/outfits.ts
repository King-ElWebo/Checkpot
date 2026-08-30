import { and, asc, eq, inArray } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfits, outfitBrands } from "@/db/schema";

export async function listPublishedOutfits() {
  const db = getDatabase();
  const rows = await db.query.outfits.findMany({
    where: eq(outfits.active, true),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
      collection: true,
      outfitBrands: {
        with: {
          brand: true,
        }
      },
      outfitCategoryAssignments: {
        with: {
          category: {
            with: {
              group: true
            }
          }
        }
      }
    },
  });

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    note: row.note,
    availabilityNote: row.availabilityNote,
    media: row.media,
    collection: row.collection,
    brands: row.outfitBrands
      .filter((ob) => ob.brand && ob.brand.active)
      .map((ob) => ({
        id: ob.brand.id,
        name: ob.brand.name,
        slug: ob.brand.slug,
      })),
    categories: row.outfitCategoryAssignments
      .filter(oca => oca.category && oca.category.active && oca.category.group.active)
      .map(oca => ({
        id: oca.category.id,
        slug: oca.category.slug,
        name: oca.category.name,
        groupId: oca.category.group.id,
        groupSlug: oca.category.group.slug
      }))
  }));
}

export async function listFeaturedOutfits() {
  const db = getDatabase();
  return db.query.outfits.findMany({
    where: and(eq(outfits.featured, true), eq(outfits.active, true)),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
    },
  });
}

export async function getOutfitsByBrandId(brandId: string) {
  const db = getDatabase();
  
  const brandOutfits = await db.query.outfitBrands.findMany({
    where: eq(outfitBrands.brandId, brandId),
    columns: { outfitId: true },
  });
  
  if (brandOutfits.length === 0) return [];
  
  return db.query.outfits.findMany({
    where: and(
      eq(outfits.active, true),
      inArray(outfits.id, brandOutfits.map((bo) => bo.outfitId))
    ),
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
    },
  });
}
