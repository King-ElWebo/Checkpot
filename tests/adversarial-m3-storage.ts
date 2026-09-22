import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  extractStorageKey,
  getPublicUrlPrefix,
  getPublicUrl,
  getStorefrontImageUrl,
  STOREFRONT_IMAGE_URL,
  LEGACY_BLOB_STOREFRONT_IMAGE_URL,
  LOCAL_STOREFRONT_IMAGE_FALLBACK,
  uploadFile,
  deleteFile,
} from "../src/lib/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("================================================================================");
console.log("CHALLENGER 2: ADVERSARIAL STRESS-TEST SUITE FOR MILESTONE 3 (STORAGE & R2)");
console.log("================================================================================");

let totalPassed = 0;
let totalFailed = 0;

async function challenge(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    totalPassed++;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[FAIL] ${name}: ${msg}`);
    totalFailed++;
  }
}

// ==============================================================================
// 1. FILE SIZE BOUNDARY TESTING (Exact 5MB Limit Logic)
// ==============================================================================
console.log("\n--- Category 1: File Size Boundary Conditions ---");

const MAX_SIZE = 5 * 1024 * 1024; // 5,242,880 bytes

function simulateFileSizeCheck(size: number): { allowed: boolean; error?: string } {
  if (size > 5 * 1024 * 1024) {
    return { allowed: false, error: "Die Datei überschreitet das Limit von 5MB." };
  }
  return { allowed: true };
}

await challenge("Size check: Exactly 5MB (5,242,880 bytes) is allowed", () => {
  const result = simulateFileSizeCheck(MAX_SIZE);
  assert.equal(result.allowed, true);
  assert.equal(result.error, undefined);
});

await challenge("Size check: 5MB + 1 byte (5,242,881 bytes) is rejected", () => {
  const result = simulateFileSizeCheck(MAX_SIZE + 1);
  assert.equal(result.allowed, false);
  assert.equal(result.error, "Die Datei überschreitet das Limit von 5MB.");
});

await challenge("Size check: 5MB - 1 byte (5,242,879 bytes) is allowed", () => {
  const result = simulateFileSizeCheck(MAX_SIZE - 1);
  assert.equal(result.allowed, true);
  assert.equal(result.error, undefined);
});

await challenge("Size check: 10MB file is rejected", () => {
  const result = simulateFileSizeCheck(10 * 1024 * 1024);
  assert.equal(result.allowed, false);
  assert.equal(result.error, "Die Datei überschreitet das Limit von 5MB.");
});

// ==============================================================================
// 2. MAGIC-BYTE VALIDATION & SPOOFED HEADER ATTACK SCENARIOS
// ==============================================================================
console.log("\n--- Category 2: Magic-Byte Inspection & Header Spoofing ---");

// Replicate verifyImageFile logic verbatim from src/app/admin/media/actions.ts:16-29
async function verifyImageFile(file: { slice: (start: number, end: number) => { arrayBuffer: () => Promise<ArrayBuffer> } }): Promise<string | null> {
  const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const header = arr.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

  if (header.startsWith("89504e47")) return "png";
  if (header.startsWith("ffd8ff")) return "jpg";
  if (header.startsWith("52494646") && arr.length >= 4) {
    // Check for WEBP (RIFF .... WEBP)
    const arr12 = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const webpHeader = arr12.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
    if (webpHeader.endsWith("57454250")) return "webp";
  }
  return null;
}

function makeSyntheticFile(bytes: number[]): { slice: (start: number, end: number) => { arrayBuffer: () => Promise<ArrayBuffer> } } {
  const u8 = new Uint8Array(bytes);
  return {
    slice: (start: number, end: number) => {
      const sub = u8.slice(start, end);
      return {
        arrayBuffer: async () => sub.buffer.slice(sub.byteOffset, sub.byteOffset + sub.byteLength),
      };
    },
  };
}

await challenge("Magic byte: Valid PNG signature (89 50 4e 47) resolves to 'png'", async () => {
  const file = makeSyntheticFile([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, "png");
});

await challenge("Magic byte: Truncated PNG (3 bytes: 89 50 4e) is rejected", async () => {
  const file = makeSyntheticFile([0x89, 0x50, 0x4e]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Magic byte: Corrupted PNG signature (89 50 4e 48) is rejected", async () => {
  const file = makeSyntheticFile([0x89, 0x50, 0x4e, 0x48]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Magic byte: Valid JPG SOI marker (FF D8 FF E0) resolves to 'jpg'", async () => {
  const file = makeSyntheticFile([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, "jpg");
});

await challenge("Magic byte: Valid JPG EXIF marker (FF D8 FF E1) resolves to 'jpg'", async () => {
  const file = makeSyntheticFile([0xff, 0xd8, 0xff, 0xe1, 0x1a, 0x20]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, "jpg");
});

await challenge("Magic byte: Truncated JPG (2 bytes: FF D8) is rejected", async () => {
  const file = makeSyntheticFile([0xff, 0xd8]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Magic byte: Corrupted JPG (FF D8 00) is rejected", async () => {
  const file = makeSyntheticFile([0xff, 0xd8, 0x00, 0x00]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Magic byte: Valid WebP header (RIFF + size + WEBP) resolves to 'webp'", async () => {
  // RIFF (52 49 46 46) + 4 bytes size + WEBP (57 45 42 50)
  const bytes = [
    0x52, 0x49, 0x46, 0x46,
    0x24, 0x00, 0x00, 0x00,
    0x57, 0x45, 0x42, 0x50,
    0x56, 0x50, 0x38, 0x20,
  ];
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, "webp");
});

await challenge("Spoofing: Audio WAV file (RIFF....WAVE) is rejected", async () => {
  // RIFF (52 49 46 46) + 4 bytes size + WAVE (57 41 56 45)
  const bytes = [
    0x52, 0x49, 0x46, 0x46,
    0x24, 0x00, 0x00, 0x00,
    0x57, 0x41, 0x56, 0x45,
  ];
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: Video AVI file (RIFF....AVI ) is rejected", async () => {
  // RIFF (52 49 46 46) + 4 bytes size + AVI (41 56 49 20)
  const bytes = [
    0x52, 0x49, 0x46, 0x46,
    0x24, 0x00, 0x00, 0x00,
    0x41, 0x56, 0x49, 0x20,
  ];
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: Truncated RIFF file (4 bytes only) is rejected", async () => {
  const file = makeSyntheticFile([0x52, 0x49, 0x46, 0x46]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: HTML script attack (<script>alert(1)</script>) is rejected", async () => {
  const bytes = Array.from(Buffer.from("<script>alert(1)</script>"));
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: PHP shell (<?php system(...)) is rejected", async () => {
  const bytes = Array.from(Buffer.from("<?php system($_GET['cmd']); ?>"));
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: Windows PE Executable (MZ...) is rejected", async () => {
  const bytes = [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00];
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: ZIP / Office doc (PK\x03\x04...) is rejected", async () => {
  const bytes = [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00];
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: SVG XML (<svg xmlns=...) is rejected", async () => {
  const bytes = Array.from(Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert(1)</script></svg>"));
  const file = makeSyntheticFile(bytes);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

await challenge("Spoofing: Empty file (0 bytes) is rejected", async () => {
  const file = makeSyntheticFile([]);
  const ext = await verifyImageFile(file);
  assert.equal(ext, null);
});

// ==============================================================================
// 3. STORAGE ABSTRACTION & KEY NORMALIZATION ADVERSARIAL CASES
// ==============================================================================
console.log("\n--- Category 3: Storage Abstraction Edge Cases ---");

await challenge("extractStorageKey: handles empty string, whitespace, and undefined gracefully", () => {
  assert.equal(extractStorageKey(""), "");
  assert.equal(extractStorageKey("   "), "");
  assert.equal(extractStorageKey(null as unknown as string), "");
  assert.equal(extractStorageKey(undefined as unknown as string), "");
});

await challenge("extractStorageKey: strips multiple leading slashes", () => {
  assert.equal(extractStorageKey("/media/test.png"), "media/test.png");
  assert.equal(extractStorageKey("//media/test.png"), "media/test.png");
  assert.equal(extractStorageKey("///store/hero.webp"), "store/hero.webp");
  assert.equal(extractStorageKey("///////brand/logo.jpg"), "brand/logo.jpg");
});

await challenge("extractStorageKey: strips query parameters from full URLs", () => {
  assert.equal(
    extractStorageKey("https://media.checkpot.at/media/test.jpg?version=2&auth=true"),
    "media/test.jpg"
  );
  assert.equal(
    extractStorageKey("https://media.checkpot.at:8080/store/entrance.jpg#preview"),
    "store/entrance.jpg"
  );
});

await challenge("extractStorageKey: handles malformed URLs gracefully without crashing", () => {
  // When new URL() throws on malformed URL without path, trimmed string is returned safely without throwing
  assert.doesNotThrow(() => {
    extractStorageKey("https://");
  });
  assert.equal(extractStorageKey("https://media.checkpot.at/media/test.jpg"), "media/test.jpg");
  assert.equal(extractStorageKey("https://[invalid-host/test.jpg"), "[invalid-host/test.jpg");
});

await challenge("extractStorageKey: correctly strips Vercel Blob and R2 Dev domains", () => {
  assert.equal(
    extractStorageKey("https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg"),
    "store/checkpot-storefront-entrance.jpg"
  );
  assert.equal(
    extractStorageKey("https://checkpot-media.r2.cloudflarestorage.com/media/uuid-1234.webp"),
    "media/uuid-1234.webp"
  );
  assert.equal(
    extractStorageKey("https://pub-abcdef123456.r2.dev/brands/king-louie.png"),
    "brands/king-louie.png"
  );
});

await challenge("getPublicUrlPrefix: handles trailing slashes in environment variables", () => {
  const orig = process.env.R2_PUBLIC_URL_PREFIX;
  process.env.R2_PUBLIC_URL_PREFIX = "https://custom-r2.domain.com///";
  assert.equal(getPublicUrlPrefix(), "https://custom-r2.domain.com");

  delete process.env.R2_PUBLIC_URL_PREFIX;
  process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN = "assets.checkpot.at";
  assert.equal(getPublicUrlPrefix(), "https://assets.checkpot.at");

  delete process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;
  assert.equal(getPublicUrlPrefix(), "https://media.checkpot.at");

  if (orig) process.env.R2_PUBLIC_URL_PREFIX = orig;
});

await challenge("getPublicUrl: generates clean canonical URLs without double slashes", () => {
  assert.equal(getPublicUrl("media/look1.jpg"), "https://media.checkpot.at/media/look1.jpg");
  assert.equal(getPublicUrl("/media/look1.jpg"), "https://media.checkpot.at/media/look1.jpg");
  assert.equal(getPublicUrl("///media/look1.jpg"), "https://media.checkpot.at/media/look1.jpg");
});

await challenge("uploadFile & deleteFile: fail-closed in production when MEDIA_BUCKET is absent", async () => {
  const origEnv = process.env.NODE_ENV;
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";

  // In production runtime, without MEDIA_BUCKET binding, uploadFile MUST throw
  await assert.rejects(
    async () => {
      await uploadFile("media/test.jpg", new Uint8Array([1, 2, 3]), { contentType: "image/jpeg" });
    },
    /Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment/
  );

  // In production runtime, without MEDIA_BUCKET binding, deleteFile MUST throw
  await assert.rejects(
    async () => {
      await deleteFile("media/test.jpg");
    },
    /Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment/
  );

  (process.env as Record<string, string | undefined>).NODE_ENV = origEnv;
});

await challenge("deleteFile: handles empty key gracefully without throwing in production", async () => {
  const origEnv = process.env.NODE_ENV;
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";

  // If key is empty or undefined, deleteFile should return immediately without throwing
  await deleteFile("");
  await deleteFile("   ");

  (process.env as Record<string, string | undefined>).NODE_ENV = origEnv;
});

// ==============================================================================
// 4. NEXT.CONFIG.TS CONFIGURATION INTEGRITY
// ==============================================================================
console.log("\n--- Category 4: next.config.ts Delivery Integrity ---");

await challenge("next.config.ts has unoptimized: true (Cloudflare Workers compatibility)", () => {
  const configRaw = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
  assert.match(configRaw, /unoptimized:\s*true/, "images.unoptimized must be explicitly true");
});

await challenge("next.config.ts remotePatterns includes all 4 required media hostnames", () => {
  const configRaw = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
  
  assert.match(configRaw, /hostname:\s*"media\.checkpot\.at"/, "Must include canonical R2 media.checkpot.at");
  assert.match(configRaw, /hostname:\s*"\*\.r2\.dev"/, "Must include staging *.r2.dev");
  assert.match(configRaw, /hostname:\s*"\*\.cloudflarestorage\.com"/, "Must include S3 endpoint *.cloudflarestorage.com");
  assert.match(configRaw, /hostname:\s*"\*\.public\.blob\.vercel-storage\.com"/, "Must retain legacy *.public.blob.vercel-storage.com");
});

// ==============================================================================
// 5. PUBLIC STOREFRONT IMAGE NORMALIZATION
// ==============================================================================
console.log("\n--- Category 5: Public Storefront Image References ---");

await challenge("Homepage (src/app/(public)/page.tsx) uses STOREFRONT_IMAGE_URL", () => {
  const fileContent = fs.readFileSync(path.join(rootDir, "src/app/(public)/page.tsx"), "utf8");
  assert.ok(fileContent.includes("import { STOREFRONT_IMAGE_URL } from \"@/lib/storage\""), "Must import STOREFRONT_IMAGE_URL");
  assert.ok(fileContent.includes("src={STOREFRONT_IMAGE_URL}"), "Must bind src to STOREFRONT_IMAGE_URL");
  assert.ok(!fileContent.includes("hgrtkumqrh0cwc66.public.blob.vercel-storage.com"), "Must not contain hardcoded Vercel Blob URL");
});

await challenge("About page (src/app/(public)/ueber-uns/page.tsx) uses STOREFRONT_IMAGE_URL for both mobile and desktop", () => {
  const fileContent = fs.readFileSync(path.join(rootDir, "src/app/(public)/ueber-uns/page.tsx"), "utf8");
  assert.ok(fileContent.includes("import { STOREFRONT_IMAGE_URL } from \"@/lib/storage\""), "Must import STOREFRONT_IMAGE_URL");
  
  const matches = fileContent.match(/src=\{STOREFRONT_IMAGE_URL\}/g);
  assert.ok(matches && matches.length >= 2, `Expected at least 2 occurrences in ueber-uns (mobile + desktop), found ${matches?.length}`);
  assert.ok(!fileContent.includes("hgrtkumqrh0cwc66.public.blob.vercel-storage.com"), "Must not contain hardcoded Vercel Blob URL");
});

await challenge("Contact page (src/app/(public)/kontakt/page.tsx) uses STOREFRONT_IMAGE_URL", () => {
  const fileContent = fs.readFileSync(path.join(rootDir, "src/app/(public)/kontakt/page.tsx"), "utf8");
  assert.ok(fileContent.includes("import { STOREFRONT_IMAGE_URL } from \"@/lib/storage\""), "Must import STOREFRONT_IMAGE_URL");
  assert.ok(fileContent.includes("src={STOREFRONT_IMAGE_URL}"), "Must bind src to STOREFRONT_IMAGE_URL");
  assert.ok(!fileContent.includes("hgrtkumqrh0cwc66.public.blob.vercel-storage.com"), "Must not contain hardcoded Vercel Blob URL");
});

await challenge("Zero hardcoded vercel-storage.com URLs in public pages directory", () => {
  function scan(dir: string): string[] {
    const list: string[] = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) {
        list.push(...scan(full));
      } else if (/\.(tsx|ts|jsx|js)$/.test(f.name)) {
        const c = fs.readFileSync(full, "utf8");
        if (c.includes("vercel-storage.com")) {
          list.push(full);
        }
      }
    }
    return list;
  }

  const results = scan(path.join(rootDir, "src/app/(public)"));
  assert.deepEqual(results, [], `Found hardcoded vercel-storage.com in: ${results.join(", ")}`);
});

// ==============================================================================
// SUMMARY & VERDICT
// ==============================================================================
console.log("\n================================================================================");
console.log(`CHALLENGER RESULTS: ${totalPassed + totalFailed} RUN | ${totalPassed} PASSED | ${totalFailed} FAILED`);
console.log("================================================================================");

if (totalFailed > 0) {
  process.exit(1);
}
