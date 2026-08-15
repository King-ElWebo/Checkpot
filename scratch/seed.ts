import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { randomUUID as uuidv4 } from "crypto";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing in .env.local");
  }

  const db = drizzle(neon(databaseUrl), { schema });

  console.log("Seeding database with images...");

  // 1. Create Media entries
  const images = [
    { url: "/customer/outfit-autumn-layer.jpg", alt: "Herbstlicher Lagenlook", title: "Autumn Layer" },
    { url: "/customer/outfit-blue-summer.jpg", alt: "Blaues Sommer Outfit", title: "Blue Summer" },
    { url: "/customer/outfit-blue-winter.jpg", alt: "Winter Outfit in Blau", title: "Blue Winter" },
    { url: "/customer/outfit-summer-pattern.jpg", alt: "Sommerkleid mit Muster", title: "Summer Pattern" },
    { url: "/customer/textile-sorgenfri-detail.jpg", alt: "Sorgenfri Detail", title: "Textile Detail" },
  ];

  const insertedMedia = await db.insert(schema.media).values(images.map(img => ({
    id: uuidv4(),
    ...img,
    focalPoint: "50% 50%",
  }))).returning();

  console.log(`Inserted ${insertedMedia.length} media items.`);

  // 2. Create Collection
  const [collection] = await db.insert(schema.collections).values({
    id: uuidv4(),
    title: "Frühlingserwachen in Hietzing",
    season: "Frühjahr 2026",
    intro: "Erfrischende Farben, fließende Stoffe und durchdachte Lagen. Unsere neueste Auswahl bringt Leichtigkeit in Ihren Alltag.",
    active: true,
    featured: true,
    sortOrder: 1,
  }).returning();

  console.log(`Inserted collection ${collection.title}.`);

  // 3. Create Outfits
  const outfitsData = insertedMedia.slice(0, 4).map((media, index) => ({
    id: uuidv4(),
    title: `Outfit ${index + 1}: ${media.title}`,
    note: "Eine perfekte Kombination für den Übergang, kuratiert von Christa.",
    availabilityNote: "Im Geschäft verfügbar",
    active: true,
    featured: true,
    sortOrder: index + 1,
    mediaId: media.id,
    collectionId: collection.id,
  }));

  const insertedOutfits = await db.insert(schema.outfits).values(outfitsData).returning();

  console.log(`Inserted ${insertedOutfits.length} outfits.`);

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Failed to seed:", err);
  process.exit(1);
});
