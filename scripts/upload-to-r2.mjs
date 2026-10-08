import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const BUCKET = "checkpot-media";
const STAGING_DIR = path.resolve("dist/r2-migration-staging");
const LEDGER_FILE = path.resolve("media-migration-ledger.json");

async function main() {
  console.log("=== Checkpot: Uploading Staged Media to Cloudflare R2 ===");
  console.log(`Target Bucket: ${BUCKET}`);
  console.log(`Source Directory: ${STAGING_DIR}\n`);

  let ledgerData;
  try {
    const raw = await fs.readFile(LEDGER_FILE, "utf-8");
    ledgerData = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read ledger from ${LEDGER_FILE}: ${err.message}`);
  }

  const items = ledgerData.items.filter((item) => item.status === "verified_staged");
  console.log(`Found ${items.length} verified staged files ready for upload.\n`);

  let uploadedCount = 0;
  for (const item of items) {
    const filePath = path.join(STAGING_DIR, item.key);
    const contentType = item.contentType || "image/jpeg";
    const objectPath = `${BUCKET}/${item.key}`;

    uploadedCount++;
    process.stdout.write(`[${uploadedCount}/${items.length}] Uploading ${item.key}... `);

    try {
      execSync(
        `npx wrangler r2 object put "${objectPath}" --file="${filePath}" --content-type="${contentType}" --remote`,
        { stdio: "pipe" }
      );
      console.log("OK");
    } catch (err) {
      console.log("FAILED");
      console.error(`Error uploading ${item.key}:`, err.message);
      process.exit(1);
    }
  }

  console.log(`\nAll ${uploadedCount} files successfully uploaded to Cloudflare R2 bucket "${BUCKET}"!`);
}

main().catch((err) => {
  console.error("Migration upload failed:", err);
  process.exit(1);
});
