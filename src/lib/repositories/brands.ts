import { and, asc, eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db";
import { brands } from "@/db/schema";
import type { BrandSeoMetadata } from "@/lib/validations/admin";
import { getOrSetCached, invalidateCache } from "@/lib/cache";

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  verifiedClaims: string[] | null;
  active: boolean;
  sortOrder: number;
  logo: {
    id: string;
    url: string;
    alt: string | null;
    focalPoint: string | null;
  } | null;
  image: {
    id: string;
    url: string;
    alt: string | null;
    focalPoint: string | null;
  } | null;
  seoMetadata: BrandSeoMetadata | null;
}

const BRANDS_PUBLISHED_CACHE_KEY = "brands:published";
const BRANDS_ALL_CACHE_KEY = "brands:all";
const BRANDS_TTL_SECONDS = 120; // 2 minutes

export function invalidateBrandsCache() {
  invalidateCache("brands");
}

export async function listPublishedBrands(): Promise<BrandDto[]> {
  if (!isDatabaseConfigured()) return [];

  return await getOrSetCached(
    BRANDS_PUBLISHED_CACHE_KEY,
    async () => {
      const db = getDatabase();
      const rows = await db.query.brands.findMany({
        where: eq(brands.active, true),
        orderBy: [asc(brands.sortOrder)],
        with: {
          logo: true,
          image: true,
        },
      });

      return rows as unknown as BrandDto[];
    },
    BRANDS_TTL_SECONDS
  );
}

export async function getPublishedBrandBySlug(slug: string): Promise<BrandDto | null> {
  if (!isDatabaseConfigured()) return null;

  // Use the cached published brands list to avoid a redundant SQL query
  const allPublished = await listPublishedBrands();
  const matched = allPublished.find((b) => b.slug === slug);
  if (matched) {
    return matched;
  }

  // Fallback to direct query if not in published list (e.g. edge-case active brand just inserted)
  const db = getDatabase();
  const row = await db.query.brands.findFirst({
    where: and(eq(brands.slug, slug), eq(brands.active, true)),
    with: {
      logo: true,
      image: true,
    },
  });

  return (row ?? null) as unknown as BrandDto | null;
}

export async function listAllBrands() {
  if (!isDatabaseConfigured()) return [];

  return await getOrSetCached(
    BRANDS_ALL_CACHE_KEY,
    async () => {
      const db = getDatabase();
      return db.query.brands.findMany({
        orderBy: [asc(brands.sortOrder)],
      });
    },
    BRANDS_TTL_SECONDS
  );
}

/**
 * Returns deterministic additional published brands in assortment sort order,
 * selecting the next `limit` brands after `currentBrandId` with wrap-around.
 */
export async function getAdditionalPublishedBrands(currentBrandId: string, limit = 3) {
  const allPublished = await listPublishedBrands();
  if (allPublished.length <= 1) return [];

  const currentIndex = allPublished.findIndex((b) => b.id === currentBrandId);
  if (currentIndex === -1) {
    return allPublished.slice(0, limit);
  }

  const additional: BrandDto[] = [];
  for (let i = 1; i < allPublished.length && additional.length < limit; i++) {
    const targetIndex = (currentIndex + i) % allPublished.length;
    additional.push(allPublished[targetIndex]);
  }
  return additional;
}
