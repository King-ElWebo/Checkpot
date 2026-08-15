import { eq, asc } from "drizzle-orm";
import { getDatabase } from "@/db";
import { outfitCategoryGroups } from "@/db/schema";

export async function listActiveTaxonomy() {
  const db = getDatabase();
  const groups = await db.query.outfitCategoryGroups.findMany({
    where: eq(outfitCategoryGroups.active, true),
    orderBy: [asc(outfitCategoryGroups.sortOrder)],
    with: {
      categories: {
        where: (categories, { eq }) => eq(categories.active, true),
        orderBy: (categories, { asc }) => [asc(categories.sortOrder)]
      }
    }
  });

  return groups.map(group => ({
    id: group.id,
    name: group.name,
    slug: group.slug,
    categories: group.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    }))
  }));
}
