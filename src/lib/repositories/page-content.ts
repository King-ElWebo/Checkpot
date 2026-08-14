import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { pageContent } from "@/db/schema";

export async function getPageContent(routeKey: string) {
  const db = getDatabase();
  return db.query.pageContent.findFirst({
    where: eq(pageContent.routeKey, routeKey),
  });
}
