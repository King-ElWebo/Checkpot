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
  console.log("=== Checkpot Media URL Rollback Script ===");

  let ledgerData;
  try {
    const raw = await fs.readFile(LEDGER_FILE, "utf-8");
    ledgerData = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read ledger from ${LEDGER_FILE}: ${err.message}`);
  }

  const itemsToRollback = ledgerData.items.filter(
    (item) => item.status === "verified_staged" || item.status === "migrated"
  );

  console.log(`Found ${itemsToRollback.length} items to restore to their original Vercel Blob URLs.`);

  let restoredCount = 0;
  for (const item of itemsToRollback) {
    await sql`UPDATE media SET url = ${item.originalUrl}, updated_at = NOW() WHERE id = ${item.id}`;
    restoredCount++;
  }

  console.log(`Successfully restored ${restoredCount} media URLs to original Vercel Blob locations.`);
  console.log("Zero data was destroyed. Rollback complete.");
}

main().catch((err) => {
  console.error("Rollback failed:", err);
  process.exit(1);
});
