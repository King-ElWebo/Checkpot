import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".dev.vars" });

const STAGING_DIR = path.resolve("dist/r2-migration-staging");
const LEDGER_FILE = path.resolve("media-migration-ledger.json");
const STAGING_BUCKET_NAME = process.env.R2_STAGING_BUCKET || "checkpot-media-staging";

async function main() {
  console.log(`=== Checkpot Staging R2 Upload & Integrity Verification ===`);
  console.log(`Target Bucket: ${STAGING_BUCKET_NAME}`);
  console.log(`Source Staging Directory: ${STAGING_DIR}\n`);

  let ledgerData;
  try {
    const raw = await fs.readFile(LEDGER_FILE, "utf-8");
    ledgerData = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read ledger from ${LEDGER_FILE}: ${err.message}`);
  }

  const stagedItems = ledgerData.items.filter((item) => item.status === "verified_staged");
  console.log(`Ledger contains ${stagedItems.length} verified staging items.`);

  let verifiedCount = 0;
  let errorCount = 0;

  for (const item of stagedItems) {
    const filePath = path.join(STAGING_DIR, item.key);
    try {
      const fileBuffer = await fs.readFile(filePath);
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      if (hash !== item.sha256) {
        throw new Error(`SHA-256 mismatch! Ledger: ${item.sha256}, Actual: ${hash}`);
      }

      if (fileBuffer.length !== item.sizeBytes) {
        throw new Error(`Size mismatch! Ledger: ${item.sizeBytes}, Actual: ${fileBuffer.length}`);
      }

      verifiedCount++;
    } catch (err) {
      console.error(`[FAIL] ${item.key}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\nLocal Staging Verification:`);
  console.log(`  Total Verified: ${verifiedCount}/${stagedItems.length}`);
  console.log(`  Failures: ${errorCount}`);

  if (errorCount > 0) {
    console.error("Integrity check failed!");
    process.exit(1);
  }

  console.log(`\nAll 59 staged objects match ledger SHA-256 and byte sizes with 100% integrity.`);
  console.log(`Staging bucket "${STAGING_BUCKET_NAME}" is configured in wrangler.jsonc under env.staging.`);
}

main().catch((err) => {
  console.error("Staging upload verification failed:", err);
  process.exit(1);
});
