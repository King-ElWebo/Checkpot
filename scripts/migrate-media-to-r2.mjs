import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env.local");
}

const sql = neon(DATABASE_URL);
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "https://media.checkpot.at";
const STAGING_DIR = path.resolve("dist/r2-migration-staging");
const LEDGER_FILE = path.resolve("media-migration-ledger.json");

function extractStorageKey(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/+/, "");
  } catch {
    return url.replace(/^\/+/, "");
  }
}

async function main() {
  console.log("=== Checkpot Media Migration: Vercel Blob -> R2 Staging & Ledger ===");
  console.log(`R2 Target Public Domain: ${R2_PUBLIC_DOMAIN}`);
  console.log(`Staging Directory: ${STAGING_DIR}\n`);

  await fs.mkdir(STAGING_DIR, { recursive: true });

  const rows = await sql`SELECT id, url, title, alt, created_at FROM media ORDER BY created_at ASC`;
  const vercelBlobRows = rows.filter((r) => r.url.includes("blob.vercel-storage.com"));

  console.log(`Found ${rows.length} total records, ${vercelBlobRows.length} hosted on Vercel Blob.`);

  const ledger = {
    migratedAt: new Date().toISOString(),
    r2PublicDomain: R2_PUBLIC_DOMAIN,
    totalRecords: rows.length,
    vercelBlobCount: vercelBlobRows.length,
    items: [],
  };

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < vercelBlobRows.length; i++) {
    const row = vercelBlobRows[i];
    const key = extractStorageKey(row.url);
    const targetFilePath = path.join(STAGING_DIR, key);
    await fs.mkdir(path.dirname(targetFilePath), { recursive: true });

    process.stdout.write(`[${i + 1}/${vercelBlobRows.length}] Downloading ${key}... `);

    try {
      const res = await fetch(row.url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      const contentType = res.headers.get("content-type") || "image/jpeg";

      await fs.writeFile(targetFilePath, buffer);

      const targetUrl = `${R2_PUBLIC_DOMAIN.replace(/\/+$/, "")}/${key}`;

      ledger.items.push({
        id: row.id,
        key,
        originalUrl: row.url,
        targetUrl,
        contentType,
        sizeBytes: buffer.length,
        sha256: hash,
        status: "verified_staged",
        title: row.title,
        verifiedAt: new Date().toISOString(),
      });

      console.log(`OK (${(buffer.length / 1024).toFixed(1)} KB, SHA-256: ${hash.slice(0, 12)}...)`);
      successCount++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failCount++;
      ledger.items.push({
        id: row.id,
        key,
        originalUrl: row.url,
        error: err.message,
        status: "failed",
      });
    }
  }

  // Also include the 5 local records in ledger for completeness
  const localRows = rows.filter((r) => !r.url.includes("blob.vercel-storage.com"));
  for (const r of localRows) {
    ledger.items.push({
      id: r.id,
      key: r.url.replace(/^\/+/, ""),
      originalUrl: r.url,
      targetUrl: r.url,
      status: "local_preserved",
      title: r.title,
    });
  }

  await fs.writeFile(LEDGER_FILE, JSON.stringify(ledger, null, 2), "utf-8");

  console.log(`\n=== Migration Staging Complete ===`);
  console.log(`Successfully verified and staged: ${successCount}`);
  console.log(`Failures: ${failCount}`);
  console.log(`Ledger written to: ${LEDGER_FILE}`);
  console.log(`All files staged at: ${STAGING_DIR}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
