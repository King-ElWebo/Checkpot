import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env.local");
}

const sql = neon(DATABASE_URL);
const LEDGER_FILE = path.resolve("media-migration-ledger.json");

async function main() {
  console.log("=== Checkpot Media URL Cutover / Apply Script ===");

  let ledgerData;
  try {
    const raw = await fs.readFile(LEDGER_FILE, "utf-8");
    ledgerData = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read ledger from ${LEDGER_FILE}: ${err.message}`);
  }

  const itemsToUpdate = ledgerData.items.filter(
    (item) => item.status === "verified_staged" && item.targetUrl && item.originalUrl
  );

  console.log(`Found ${itemsToUpdate.length} verified items to update to R2 public delivery URLs.`);

  let updatedCount = 0;
  for (const item of itemsToUpdate) {
    await sql`UPDATE media SET url = ${item.targetUrl}, updated_at = NOW() WHERE id = ${item.id}`;
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} media URLs in Neon database to R2 targets.`);
}

main().catch((err) => {
  console.error("Apply failed:", err);
  process.exit(1);
});
