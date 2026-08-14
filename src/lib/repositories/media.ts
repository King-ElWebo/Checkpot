import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { media } from "@/db/schema";

export async function getMediaById(id: string) {
  const db = getDatabase();
  return db.query.media.findFirst({
    where: eq(media.id, id),
  });
}
