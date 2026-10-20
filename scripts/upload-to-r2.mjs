import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const BUCKET = "checkpot-media";
const STAGING_DIR = path.resolve("dist/r2-migration-staging");
const LEDGER_FILE = path.resolve("media-migration-ledger.json");

function isImmutableKey(key) {
  const base = key.split("/").pop() || "";
  // UUID pattern (e.g. 5ff83f98-e70c-4ddc-80ea-3486aeeaa1c6.jpg)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i.test(base)) {
    return true;
  }
  // High-entropy random alphanumeric suffix of 16+ chars (e.g. checkpot-logo-50W8fYc6aBPigdFsZi3befoTr5ff3u.svg)
  if (/-[a-zA-Z0-9]{16,}\.[a-z0-9]+$/i.test(base)) {
    return true;
  }
  return false;
}

async function main() {
  console.log("=== Checkpot: Uploading Optimized Media to Cloudflare R2 ===");
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

    const immutable = isImmutableKey(item.key);
    const cacheControl = immutable
      ? "public, max-age=31536000, immutable"
      : "public, max-age=86400, stale-while-revalidate=604800";

    uploadedCount++;
    process.stdout.write(`[${uploadedCount}/${items.length}] Uploading ${item.key} (${immutable ? "immutable" : "mutable, 1d"})... `);

    try {
      execSync(
        `npx wrangler r2 object put "${objectPath}" --file="${filePath}" --content-type="${contentType}" --cache-control="${cacheControl}" --remote`,
        { stdio: "pipe" }
      );
      console.log("OK");
    } catch (err) {
      console.log("FAILED");
      console.error(`Error uploading ${item.key}:`, err.message);
      process.exit(1);
    }
  }

  console.log(`\nAll ${uploadedCount} optimized files successfully uploaded to Cloudflare R2 bucket "${BUCKET}" with safe, tailored cache headers!`);
}

main().catch((err) => {
  console.error("Migration upload failed:", err);
  process.exit(1);
});
