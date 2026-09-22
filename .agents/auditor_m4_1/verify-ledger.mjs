import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const LEDGER_PATH = path.resolve("media-migration-ledger.json");
const STAGING_DIR = path.resolve("dist/r2-migration-staging");

function detectFileType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  const str = buffer.toString("utf-8", 0, Math.min(buffer.length, 500)).trim();
  if (str.startsWith("<svg") || (str.startsWith("<?xml") && str.includes("<svg"))) {
    return "image/svg+xml";
  }
  return "unknown/binary";
}

async function verifyAll() {
  console.log("=== Exhaustive 59/59 Forensic Audit of Staged & Remote Vercel Blob Media ===");

  const rawLedger = await fs.readFile(LEDGER_PATH, "utf-8");
  const ledger = JSON.parse(rawLedger);
  const stagedItems = ledger.items.filter((i) => i.status === "verified_staged");

  console.log(`Auditing ${stagedItems.length} staged items...`);

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < stagedItems.length; i++) {
    const item = stagedItems[i];
    const filePath = path.join(STAGING_DIR, item.key);

    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch (e) {
      results.push({ key: item.key, status: "FAIL", reason: `File missing on disk: ${e.message}` });
      failedCount++;
      continue;
    }

    const buf = await fs.readFile(filePath);
    const diskHash = crypto.createHash("sha256").update(buf).digest("hex");
    const detectedType = detectFileType(buf);

    if (stat.size !== item.sizeBytes) {
      results.push({ key: item.key, status: "FAIL", reason: `Size mismatch: disk=${stat.size}, ledger=${item.sizeBytes}` });
      failedCount++;
      continue;
    }

    if (diskHash !== item.sha256) {
      results.push({ key: item.key, status: "FAIL", reason: `Hash mismatch: disk=${diskHash}, ledger=${item.sha256}` });
      failedCount++;
      continue;
    }

    // Verify remote HTTP GET
    let remoteStatus = 0;
    let remoteHash = "";
    try {
      const resp = await fetch(item.originalUrl);
      remoteStatus = resp.status;
      if (resp.ok) {
        const rBuf = Buffer.from(await resp.arrayBuffer());
        remoteHash = crypto.createHash("sha256").update(rBuf).digest("hex");
      }
    } catch (err) {
      results.push({ key: item.key, status: "FAIL", reason: `Remote fetch error: ${err.message}` });
      failedCount++;
      continue;
    }

    if (remoteStatus !== 200) {
      results.push({ key: item.key, status: "FAIL", reason: `Remote returned HTTP ${remoteStatus}` });
      failedCount++;
      continue;
    }

    if (remoteHash !== item.sha256) {
      results.push({ key: item.key, status: "FAIL", reason: `Remote hash mismatch: remote=${remoteHash}, local=${item.sha256}` });
      failedCount++;
      continue;
    }

    results.push({
      key: item.key,
      status: "PASS",
      sizeBytes: stat.size,
      sha256: diskHash,
      detectedType,
      remoteStatus,
    });
    passedCount++;
    process.stdout.write(`.`);
  }

  console.log(`\n\nAudit Complete:`);
  console.log(`PASSED: ${passedCount}/${stagedItems.length}`);
  console.log(`FAILED: ${failedCount}/${stagedItems.length}`);

  const summaryArtifact = path.resolve(".agents/auditor_m4_1/audit-evidence.json");
  await fs.writeFile(summaryArtifact, JSON.stringify({ passedCount, failedCount, results }, null, 2), "utf-8");
  console.log(`Detailed audit evidence saved to ${summaryArtifact}`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

verifyAll().catch((err) => {
  console.error("Exhaustive verification error:", err);
  process.exit(1);
});
