import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { collections } from "@/db/schema";

export async function listPublishedCollections() {
  const db = getDatabase();
  return db.query.collections.findMany({
    where: eq(collections.active, true),
    orderBy: [asc(collections.sortOrder)],
    with: {
      outfits: {
        with: {
          media: true,
        }
      }
    }
  });
}
