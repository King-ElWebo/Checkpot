import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const STAGING_DIR = path.resolve("dist/r2-migration-staging");

async function optimizeR2Image(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg") return null;

  const originalBuffer = fs.readFileSync(filePath);
  const originalSize = originalBuffer.length;

  const image = sharp(originalBuffer);
  const metadata = await image.metadata();

  const maxWidth = 1600;
  const maxHeight = 1600;
  const shouldResize = metadata.width > maxWidth || metadata.height > maxHeight;

  let pipeline = sharp(originalBuffer);
  if (shouldResize) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const optimizedJpg = await pipeline
    .jpeg({
      quality: 84,
      progressive: true,
      mozjpeg: true,
      trellisQuantisation: true,
      overshootDeringing: true,
    })
    .toBuffer();

  fs.writeFileSync(filePath, optimizedJpg);

  const saved = originalSize - optimizedJpg.length;
  const pct = Math.round((saved / originalSize) * 100);
  console.log(
    `[R2] ${path.relative(STAGING_DIR, filePath).padEnd(45)} ${(originalSize / 1024).toFixed(0).padStart(5)} KB -> ${(optimizedJpg.length / 1024).toFixed(0).padStart(5)} KB (-${pct}%)`
  );

  return { originalSize, optimizedSize: optimizedJpg.length };
}

async function scanAndOptimize(dir) {
  let totalOrig = 0;
  let totalOpt = 0;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      const res = await scanAndOptimize(full);
      totalOrig += res.totalOrig;
      totalOpt += res.totalOpt;
    } else {
      const res = await optimizeR2Image(full);
      if (res) {
        totalOrig += res.originalSize;
        totalOpt += res.optimizedSize;
      }
    }
  }

  return { totalOrig, totalOpt };
}

async function main() {
  console.log("=== Optimizing R2 Staged Media (59 Objects) ===\n");
  const stats = await scanAndOptimize(STAGING_DIR);

  console.log("\n=======================================================");
  console.log(`Original R2 Total:  ${(stats.totalOrig / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized R2 Total: ${(stats.totalOpt / (1024 * 1024)).toFixed(2)} MB (-${Math.round(((stats.totalOrig - stats.totalOpt) / stats.totalOrig) * 100)}%)`);
  console.log(`Total R2 Saved:     ${((stats.totalOrig - stats.totalOpt) / (1024 * 1024)).toFixed(2)} MB`);
  console.log("=======================================================");
}

main().catch(console.error);
