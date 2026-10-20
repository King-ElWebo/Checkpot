import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CUSTOMER_DIR = path.resolve("public/customer");

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg") return;

  const originalBuffer = fs.readFileSync(filePath);
  const originalSize = originalBuffer.length;

  const image = sharp(originalBuffer);
  const metadata = await image.metadata();

  // Max dimension 1600px, fit inside, without enlargement
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

  // Progressive MozJPEG with high quality (84) for visual perfection and color fidelity
  const optimizedJpg = await pipeline
    .jpeg({
      quality: 84,
      progressive: true,
      mozjpeg: true,
      trellisQuantisation: true,
      overshootDeringing: true,
    })
    .toBuffer();

  // Also produce WebP variant for modern browsers
  let webpPipeline = sharp(originalBuffer);
  if (shouldResize) {
    webpPipeline = webpPipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  const optimizedWebp = await webpPipeline
    .webp({
      quality: 85,
      effort: 6,
    })
    .toBuffer();

  const webpPath = filePath.replace(/\.jpe?g$/i, ".webp");
  fs.writeFileSync(webpPath, optimizedWebp);

  // Write optimized JPG in-place
  fs.writeFileSync(filePath, optimizedJpg);

  const saved = originalSize - optimizedJpg.length;
  const pct = Math.round((saved / originalSize) * 100);
  console.log(
    `[JPG] ${path.relative(CUSTOMER_DIR, filePath).padEnd(35)} ${(originalSize / 1024).toFixed(0).padStart(4)} KB -> ${(optimizedJpg.length / 1024).toFixed(0).padStart(4)} KB (-${pct}%) | WebP: ${(optimizedWebp.length / 1024).toFixed(0)} KB`
  );

  return { originalSize, jpgSize: optimizedJpg.length, webpSize: optimizedWebp.length };
}

async function scanAndOptimize(dir) {
  let totalOrig = 0;
  let totalJpg = 0;
  let totalWebp = 0;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      const res = await scanAndOptimize(full);
      totalOrig += res.totalOrig;
      totalJpg += res.totalJpg;
      totalWebp += res.totalWebp;
    } else {
      const res = await optimizeImage(full);
      if (res) {
        totalOrig += res.originalSize;
        totalJpg += res.jpgSize;
        totalWebp += res.webpSize;
      }
    }
  }

  return { totalOrig, totalJpg, totalWebp };
}

async function main() {
  console.log("=== Optimizing Customer Images with High-Fidelity MozJPEG & WebP ===\n");
  const stats = await scanAndOptimize(CUSTOMER_DIR);

  // Also create a dedicated mobile portrait for mobile hero LCP optimization
  const portraitOriginal = fs.readFileSync(path.join(CUSTOMER_DIR, "christa-boutique-portrait.jpg"));
  const mobilePortraitJpg = await sharp(portraitOriginal)
    .resize({ width: 720, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
  const mobilePortraitWebp = await sharp(portraitOriginal)
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toBuffer();

  fs.writeFileSync(path.join(CUSTOMER_DIR, "christa-boutique-portrait-mobile.jpg"), mobilePortraitJpg);
  fs.writeFileSync(path.join(CUSTOMER_DIR, "christa-boutique-portrait-mobile.webp"), mobilePortraitWebp);
  console.log(`\n[Mobile Hero LCP] christa-boutique-portrait-mobile.jpg: ${(mobilePortraitJpg.length / 1024).toFixed(0)} KB, WebP: ${(mobilePortraitWebp.length / 1024).toFixed(0)} KB`);

  console.log("\n=======================================================");
  console.log(`Original total:  ${(stats.totalOrig / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized JPG:   ${(stats.totalJpg / (1024 * 1024)).toFixed(2)} MB (-${Math.round(((stats.totalOrig - stats.totalJpg) / stats.totalOrig) * 100)}%)`);
  console.log(`Optimized WebP:  ${(stats.totalWebp / (1024 * 1024)).toFixed(2)} MB (-${Math.round(((stats.totalOrig - stats.totalWebp) / stats.totalOrig) * 100)}%)`);
  console.log(`Total saved:     ${((stats.totalOrig - stats.totalJpg) / (1024 * 1024)).toFixed(2)} MB`);
  console.log("=======================================================");
}

main().catch(console.error);
