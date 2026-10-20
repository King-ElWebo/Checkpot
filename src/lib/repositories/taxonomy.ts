import { eq, asc } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db";
import { outfitCategoryGroups } from "@/db/schema";
import { getOrSetCached, invalidateCache } from "@/lib/cache";

const TAXONOMY_CACHE_KEY = "taxonomy:active";
const TAXONOMY_TTL_SECONDS = 300; // 5 minutes

export function invalidateTaxonomyCache() {
  invalidateCache("taxonomy");
}

export async function listActiveTaxonomy() {
  if (!isDatabaseConfigured()) return [];

  return await getOrSetCached(
    TAXONOMY_CACHE_KEY,
    async () => {
      const db = getDatabase();

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
          categories: group.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          })),
        }))
        .filter((group) => group.categories.length > 0);
    },
    TAXONOMY_TTL_SECONDS
  );
}
