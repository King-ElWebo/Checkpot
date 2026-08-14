import { and, asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";

export async function listPublishedBrands() {
  const db = getDatabase();
  return db.query.brands.findMany({
    where: eq(brands.active, true),
    orderBy: [asc(brands.sortOrder)],
    with: {
      logo: true,
      image: true,
    },
  });
}

export async function getPublishedBrandBySlug(slug: string) {
  const db = getDatabase();
  return db.query.brands.findFirst({
    where: and(eq(brands.slug, slug), eq(brands.active, true)),
    with: {
      logo: true,
      image: true,
    },
  });
}

export async function listAllBrands() {
  const db = getDatabase();
  return db.query.brands.findMany({
    orderBy: [asc(brands.sortOrder)],
  });
}
