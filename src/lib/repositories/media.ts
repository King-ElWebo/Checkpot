import { desc, eq, or } from "drizzle-orm";
import { getDatabase } from "@/db";
import { media, brands, outfits } from "@/db/schema";

export type MediaDto = {
  id: string;
  url: string;
  title: string | null;
  alt: string | null;
  rights: string | null;
  focalPoint: string | null;
  season: string | null;
  createdAt: Date;
};

export type MediaUsage = {
  totalCount: number;
  brands: {
    id: string;
    name: string;
    slug: string;
    role: "logo" | "image";
  }[];
  outfits: {
    id: string;
    title: string;
  }[];
};

export async function getMediaById(id: string) {
  const db = getDatabase();
  return db.query.media.findFirst({
    where: eq(media.id, id),
  });
}

export async function listAllMediaForAdmin(): Promise<MediaDto[]> {
  const db = getDatabase();
  const rows = await db.query.media.findMany({
    orderBy: [desc(media.createdAt)],
  });

  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    title: row.title,
    alt: row.alt,
    rights: row.rights,
    focalPoint: row.focalPoint,
    season: row.season,
    createdAt: row.createdAt,
  }));
}

export async function getMediaUsage(mediaId: string): Promise<MediaUsage> {
  const db = getDatabase();

  // Find all referencing Brands (regardless of active status)
  const referencingBrands = await db.query.brands.findMany({
    where: or(eq(brands.logoMediaId, mediaId), eq(brands.imageMediaId, mediaId)),
    columns: {
      id: true,
      name: true,
      slug: true,
      logoMediaId: true,
      imageMediaId: true,
    },
  });

  // Find all referencing Outfits (regardless of active status)
  const referencingOutfits = await db.query.outfits.findMany({
    where: eq(outfits.mediaId, mediaId),
    columns: {
      id: true,
      title: true,
    },
  });

  const brandUsages: MediaUsage["brands"] = [];
  for (const b of referencingBrands) {
    if (b.logoMediaId === mediaId) {
      brandUsages.push({ id: b.id, name: b.name, slug: b.slug, role: "logo" });
    }
    if (b.imageMediaId === mediaId) {
      brandUsages.push({ id: b.id, name: b.name, slug: b.slug, role: "image" });
    }
  }

  const outfitUsages: MediaUsage["outfits"] = referencingOutfits.map((o) => ({
    id: o.id,
    title: o.title,
  }));

  return {
    totalCount: brandUsages.length + outfitUsages.length,
    brands: brandUsages,
    outfits: outfitUsages,
  };
}
