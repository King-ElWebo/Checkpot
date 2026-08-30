import { eq, asc } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfitCategoryGroups, outfitCategoryAssignments, outfits } from "@/db/schema";

export async function listActiveTaxonomy() {
  const db = getDatabase();

  // Find all category IDs assigned to at least one published (active) outfit
  const activeAssignments = await db
    .select({ categoryId: outfitCategoryAssignments.categoryId })
    .from(outfitCategoryAssignments)
    .innerJoin(outfits, eq(outfitCategoryAssignments.outfitId, outfits.id))
    .where(eq(outfits.active, true));

  const usedCategoryIds = new Set(activeAssignments.map((a) => a.categoryId));

  const groups = await db.query.outfitCategoryGroups.findMany({
    where: eq(outfitCategoryGroups.active, true),
    orderBy: [asc(outfitCategoryGroups.sortOrder)],
    with: {
      categories: {
        where: (categories, { eq }) => eq(categories.active, true),
        orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
      },
    },
  });

  return groups
    .map((group) => ({
      id: group.id,
      name: group.name,
      slug: group.slug,
      categories: group.categories
        .filter((cat) => usedCategoryIds.has(cat.id))
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
    }))
    .filter((group) => group.categories.length > 0);
}
