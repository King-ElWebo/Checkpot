import { and, asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";
import type { BrandSeoMetadata } from "@/lib/validations/admin";

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

export async function listPublishedBrands() {
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
}

export async function getPublishedBrandBySlug(slug: string) {
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
  const db = getDatabase();
  return db.query.brands.findMany({
    orderBy: [asc(brands.sortOrder)],
  });
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
