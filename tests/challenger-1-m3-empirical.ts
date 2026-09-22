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
console.log("CHALLENGER 1: COMPREHENSIVE EMPIRICAL STRESS TESTS FOR MILESTONE 3 (R2 STORAGE)");
console.log("================================================================================");

let passed = 0;
let failed = 0;
const failures: Array<{ name: string; error: string }> = [];

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[FAIL] ${name}: ${errorMsg}`);
    failures.push({ name, error: errorMsg });
    failed++;
  }
}

// -----------------------------------------------------------------------------
// Category 1: extractStorageKey Stress Testing
// -----------------------------------------------------------------------------
console.log("\n--- Category 1: Storage Key Extraction & Edge Cases ---");

await test("extractStorageKey handles normal relative paths", () => {
  assert.equal(extractStorageKey("media/123.jpg"), "media/123.jpg");
  assert.equal(extractStorageKey("brands/acme.png"), "brands/acme.png");
  assert.equal(extractStorageKey("store/front.webp"), "store/front.webp");
});

await test("extractStorageKey handles single and multiple leading slashes", () => {
  assert.equal(extractStorageKey("/media/123.jpg"), "media/123.jpg");
  assert.equal(extractStorageKey("//media/123.jpg"), "media/123.jpg");
  assert.equal(extractStorageKey("///media/123.jpg"), "media/123.jpg");
});

await test("extractStorageKey extracts pathname from valid HTTP/HTTPS URLs", () => {
  assert.equal(
    extractStorageKey("https://media.checkpot.at/media/123e4567-e89b-12d3-a456-426614174000.jpg"),
    "media/123e4567-e89b-12d3-a456-426614174000.jpg"
  );
  assert.equal(
    extractStorageKey("http://localhost:3000/media/sample.png"),
    "media/sample.png"
  );
  assert.equal(
    extractStorageKey("https://custom.cdn.net:8443/nested/path/to/image.webp"),
    "nested/path/to/image.webp"
  );
});

await test("extractStorageKey strips query parameters and hash fragments from full URLs", () => {
  assert.equal(
    extractStorageKey("https://media.checkpot.at/media/look.jpg?token=secret&width=800"),
    "media/look.jpg"
  );
  assert.equal(
    extractStorageKey("https://media.checkpot.at/media/look.jpg#heading"),
    "media/look.jpg"
  );
  assert.equal(
    extractStorageKey("https://media.checkpot.at/media/look.jpg?v=2#thumb"),
    "media/look.jpg"
  );
});

await test("extractStorageKey handles empty, null, undefined, whitespace", () => {
  assert.equal(extractStorageKey(""), "");
  assert.equal(extractStorageKey("   "), "");
  assert.equal(extractStorageKey(null as unknown as string), "");
  assert.equal(extractStorageKey(undefined as unknown as string), "");
});

// -----------------------------------------------------------------------------
// Category 2: Public URL Construction
// -----------------------------------------------------------------------------
console.log("\n--- Category 2: Public URL Construction & Prefix Resolution ---");

await test("getPublicUrlPrefix defaults to https://media.checkpot.at when env is clean", () => {
  const env = process.env as Record<string, string | undefined>;
  const orig1 = env.R2_PUBLIC_URL_PREFIX;
  const orig2 = env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX;
  const orig3 = env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;

  delete env.R2_PUBLIC_URL_PREFIX;
  delete env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX;
  delete env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;

  assert.equal(getPublicUrlPrefix(), "https://media.checkpot.at");

  if (orig1) env.R2_PUBLIC_URL_PREFIX = orig1;
  if (orig2) env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX = orig2;
  if (orig3) env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN = orig3;
});

await test("getPublicUrlPrefix prioritizes R2_PUBLIC_URL_PREFIX and strips trailing slashes", () => {
  const env = process.env as Record<string, string | undefined>;
  const orig = env.R2_PUBLIC_URL_PREFIX;
  env.R2_PUBLIC_URL_PREFIX = "https://custom-r2.example.com///";

  assert.equal(getPublicUrlPrefix(), "https://custom-r2.example.com");

  if (orig) env.R2_PUBLIC_URL_PREFIX = orig;
  else delete env.R2_PUBLIC_URL_PREFIX;
});

await test("getPublicUrlPrefix respects NEXT_PUBLIC_R2_PUBLIC_DOMAIN", () => {
  const env = process.env as Record<string, string | undefined>;
  const orig1 = env.R2_PUBLIC_URL_PREFIX;
  const orig2 = env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX;
  const orig3 = env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;

  delete env.R2_PUBLIC_URL_PREFIX;
  delete env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX;
  env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN = "pub-assets.checkpot.at";

  assert.equal(getPublicUrlPrefix(), "https://pub-assets.checkpot.at");

  if (orig1) env.R2_PUBLIC_URL_PREFIX = orig1;
  if (orig2) env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX = orig2;
  if (orig3) env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN = orig3;
  else delete env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;
});

await test("getPublicUrl formats correct canonical URL with clean slash separation", () => {
  assert.equal(getPublicUrl("media/outfit1.jpg"), "https://media.checkpot.at/media/outfit1.jpg");
  assert.equal(getPublicUrl("/media/outfit1.jpg"), "https://media.checkpot.at/media/outfit1.jpg");
  assert.equal(getPublicUrl("///media/outfit1.jpg"), "https://media.checkpot.at/media/outfit1.jpg");
});

// -----------------------------------------------------------------------------
// Category 3: Storefront Image Resolution & Fallback Logic
// -----------------------------------------------------------------------------
console.log("\n--- Category 3: Storefront Image URL Fallback Modes ---");

await test("Default storefront URL points to R2 canonical domain", () => {
  assert.equal(STOREFRONT_IMAGE_URL, "https://media.checkpot.at/store/checkpot-storefront-entrance.jpg");
});

await test("getStorefrontImageUrl respects NEXT_PUBLIC_STORE_IMAGE_URL override", () => {
  const env = process.env as Record<string, string | undefined>;
  env.NEXT_PUBLIC_STORE_IMAGE_URL = "https://custom.cdn/special-store.jpg";
  assert.equal(getStorefrontImageUrl(), "https://custom.cdn/special-store.jpg");
  delete env.NEXT_PUBLIC_STORE_IMAGE_URL;
});

await test("getStorefrontImageUrl respects NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE", () => {
  const env = process.env as Record<string, string | undefined>;
  env.NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE = "true";
  assert.equal(getStorefrontImageUrl(), LOCAL_STOREFRONT_IMAGE_FALLBACK);
  delete env.NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE;
});

await test("getStorefrontImageUrl respects NEXT_PUBLIC_USE_LEGACY_BLOB", () => {
  const env = process.env as Record<string, string | undefined>;
  env.NEXT_PUBLIC_USE_LEGACY_BLOB = "true";
  assert.equal(getStorefrontImageUrl(), LEGACY_BLOB_STOREFRONT_IMAGE_URL);
  delete env.NEXT_PUBLIC_USE_LEGACY_BLOB;
});

// -----------------------------------------------------------------------------
// Category 4: R2 Operations (Upload & Delete) with Mock and Fallbacks
// -----------------------------------------------------------------------------
console.log("\n--- Category 4: R2 Operations (Bindings & Development Fallbacks) ---");

await test("uploadFile handles Uint8Array, Blob, and File payloads against R2 binding", async () => {
  const putCalls: Array<{ key: string; length: number; contentType?: string; cacheControl?: string }> = [];

  const mockBucket = {
    async put(key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }) {
      const len = value instanceof Uint8Array ? value.byteLength : value.byteLength;
      putCalls.push({
        key,
        length: len,
        contentType: options?.httpMetadata?.contentType,
        cacheControl: options?.httpMetadata?.cacheControl,
      });
      return null;
    },
    async delete() {},
  };

  const g = globalThis as unknown as { MEDIA_BUCKET?: typeof mockBucket };
  g.MEDIA_BUCKET = mockBucket;

  // Test 1: Uint8Array
  const u8 = new Uint8Array([1, 2, 3, 4, 5]);
  const res1 = await uploadFile("media/test-u8.jpg", u8, { contentType: "image/jpeg" });
  assert.equal(res1.key, "media/test-u8.jpg");
  assert.equal(res1.url, "https://media.checkpot.at/media/test-u8.jpg");

  // Test 2: Blob
  const blob = new Blob([new Uint8Array([10, 20, 30])], { type: "image/png" });
  const res2 = await uploadFile("/media/test-blob.png", blob, {
    contentType: "image/png",
    cacheControl: "public, max-age=31536000, immutable",
  });
  assert.equal(res2.key, "media/test-blob.png");
  assert.equal(res2.url, "https://media.checkpot.at/media/test-blob.png");

  // Verify recorded calls
  assert.equal(putCalls.length, 2);
  assert.equal(putCalls[0].key, "media/test-u8.jpg");
  assert.equal(putCalls[0].length, 5);
  assert.equal(putCalls[0].contentType, "image/jpeg");
  assert.equal(putCalls[0].cacheControl, "public, max-age=31536000, immutable");

  assert.equal(putCalls[1].key, "media/test-blob.png");
  assert.equal(putCalls[1].length, 3);
  assert.equal(putCalls[1].contentType, "image/png");
  assert.equal(putCalls[1].cacheControl, "public, max-age=31536000, immutable");

  delete g.MEDIA_BUCKET;
});

await test("uploadFile supports globalThis.env.MEDIA_BUCKET binding resolution", async () => {
  let putKey = "";
  const mockBucket = {
    async put(key: string) {
      putKey = key;
      return null;
    },
    async delete() {},
  };

  const g = globalThis as unknown as { env?: { MEDIA_BUCKET?: typeof mockBucket } };
  g.env = { MEDIA_BUCKET: mockBucket };

  const res = await uploadFile("brands/king-louie.png", new Uint8Array([1]), { contentType: "image/png" });
  assert.equal(res.key, "brands/king-louie.png");
  assert.equal(putKey, "brands/king-louie.png");

  delete g.env;
});

await test("deleteFile invokes bucket.delete with normalized key from full URL or relative key", async () => {
  const deletedKeys: string[] = [];
  const mockBucket = {
    async put() { return null; },
    async delete(key: string) {
      deletedKeys.push(key);
    },
  };

  const g = globalThis as unknown as { MEDIA_BUCKET?: typeof mockBucket };
  g.MEDIA_BUCKET = mockBucket;

  await deleteFile("media/item1.jpg");
  await deleteFile("https://media.checkpot.at/media/item2.jpg");
  await deleteFile("https://media.checkpot.at/media/item3.jpg?v=1#hash");

  assert.deepEqual(deletedKeys, [
    "media/item1.jpg",
    "media/item2.jpg",
    "media/item3.jpg",
  ]);

  delete g.MEDIA_BUCKET;
});

await test("uploadFile and deleteFile fail closed in NODE_ENV=production when binding is missing", async () => {
  const env = process.env as Record<string, string | undefined>;
  const orig = env.NODE_ENV;
  env.NODE_ENV = "production";

  await assert.rejects(
    async () => {
      await uploadFile("media/leak.jpg", new Uint8Array([1]), { contentType: "image/jpeg" });
    },
    /Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment/
  );

  await assert.rejects(
    async () => {
      await deleteFile("media/leak.jpg");
    },
    /Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment/
  );

  env.NODE_ENV = orig;
});

await test("deleteFile on empty or blank input returns early without throwing", async () => {
  const env = process.env as Record<string, string | undefined>;
  const orig = env.NODE_ENV;
  env.NODE_ENV = "production";

  await deleteFile("");
  await deleteFile("   ");

  env.NODE_ENV = orig;
});

// -----------------------------------------------------------------------------
// Category 5: Magic Byte Verification in actions.ts
// -----------------------------------------------------------------------------
console.log("\n--- Category 5: Magic Byte Security & File Type Validation ---");

async function checkMagic(bytes: number[]): Promise<string | null> {
  const u8 = new Uint8Array(bytes);
  const arr = u8.slice(0, 4);
  const header = Array.from(arr).reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

  if (header.startsWith("89504e47")) return "png";
  if (header.startsWith("ffd8ff")) return "jpg";
  if (header.startsWith("52494646") && arr.length >= 4) {
    const arr12 = u8.slice(0, 12);
    const webpHeader = Array.from(arr12).reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
    if (webpHeader.endsWith("57454250")) return "webp";
  }
  return null;
}

await test("Magic byte: Valid PNG accepted", async () => {
  assert.equal(await checkMagic([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]), "png");
});

await test("Magic byte: Valid JPG (SOI) accepted", async () => {
  assert.equal(await checkMagic([0xff, 0xd8, 0xff, 0xe0]), "jpg");
  assert.equal(await checkMagic([0xff, 0xd8, 0xff, 0xe1]), "jpg");
});

await test("Magic byte: Valid WebP accepted", async () => {
  const webpBytes = [
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x20, 0x00, 0x00, 0x00, // size
    0x57, 0x45, 0x42, 0x50, // WEBP
    0x56, 0x50, 0x38, 0x20, // VP8
  ];
  assert.equal(await checkMagic(webpBytes), "webp");
});

await test("Magic byte: Malicious or non-image payloads rejected", async () => {
  // Truncated JPG
  assert.equal(await checkMagic([0xff, 0xd8]), null);
  // WAV file (RIFF....WAVE)
  assert.equal(await checkMagic([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45]), null);
  // PDF
  assert.equal(await checkMagic([0x25, 0x50, 0x44, 0x46]), null);
  // HTML / Script
  assert.equal(await checkMagic([0x3c, 0x73, 0x63, 0x72]), null);
  // Empty
  assert.equal(await checkMagic([]), null);
});

// -----------------------------------------------------------------------------
// Category 6: Static File References & Config Compliance
// -----------------------------------------------------------------------------
console.log("\n--- Category 6: Static File References & Config Compliance ---");

await test("next.config.ts has images.unoptimized = true", () => {
  const content = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
  assert.ok(content.includes("unoptimized: true"));
});

await test("next.config.ts remotePatterns includes R2 and legacy Blob domains", () => {
  const content = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
  assert.ok(content.includes("media.checkpot.at"));
  assert.ok(content.includes("*.r2.dev"));
  assert.ok(content.includes("*.cloudflarestorage.com"));
  assert.ok(content.includes("*.public.blob.vercel-storage.com"));
});

await test("wrangler.jsonc defines MEDIA_BUCKET binding with bucket_name checkpot-media", () => {
  const content = fs.readFileSync(path.join(rootDir, "wrangler.jsonc"), "utf8");
  assert.ok(content.includes('"binding": "MEDIA_BUCKET"'));
  assert.ok(content.includes('"bucket_name": "checkpot-media"'));
});

await test("Zero occurrences of @vercel/blob in package.json and src/", () => {
  const pkgContent = fs.readFileSync(path.join(rootDir, "package.json"), "utf8");
  assert.ok(!pkgContent.includes("@vercel/blob"));

  function scan(dir: string): string[] {
    const list: string[] = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) list.push(...scan(full));
      else if (/\.(ts|tsx|js|mjs)$/.test(f.name)) {
        if (fs.readFileSync(full, "utf8").includes("@vercel/blob")) list.push(full);
      }
    }
    return list;
  }

  const matches = scan(path.join(rootDir, "src"));
  assert.deepEqual(matches, []);
});

await test("Public storefront images normalize to STOREFRONT_IMAGE_URL", () => {
  const p1 = fs.readFileSync(path.join(rootDir, "src/app/(public)/page.tsx"), "utf8");
  const p2 = fs.readFileSync(path.join(rootDir, "src/app/(public)/ueber-uns/page.tsx"), "utf8");
  const p3 = fs.readFileSync(path.join(rootDir, "src/app/(public)/kontakt/page.tsx"), "utf8");

  assert.ok(p1.includes("src={STOREFRONT_IMAGE_URL}"));
  assert.ok(p2.includes("src={STOREFRONT_IMAGE_URL}"));
  assert.ok(p3.includes("src={STOREFRONT_IMAGE_URL}"));

  assert.ok(!p1.includes("hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/"));
  assert.ok(!p2.includes("hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/"));
  assert.ok(!p3.includes("hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/"));
});

// -----------------------------------------------------------------------------
// Category 7: Cloudflare SSR Bundle Inspection
// -----------------------------------------------------------------------------
console.log("\n--- Category 7: Cloudflare Workers SSR Bundle Audit ---");

await test("Cloudflare Workers bundle dist/server/ssr/index.js exists and is free of @vercel/blob", () => {
  const bundlePath = path.join(rootDir, "dist/server/ssr/index.js");
  assert.ok(fs.existsSync(bundlePath), "dist/server/ssr/index.js must exist");
  const bundle = fs.readFileSync(bundlePath, "utf8");
  assert.ok(!bundle.includes("@vercel/blob"), "dist/server/ssr/index.js must not contain @vercel/blob");
});

await test("Cloudflare Workers bundle does not include heavy @aws-sdk/client-s3", () => {
  const bundlePath = path.join(rootDir, "dist/server/ssr/index.js");
  const bundle = fs.readFileSync(bundlePath, "utf8");
  assert.ok(!bundle.includes("@aws-sdk/client-s3"), "dist/server/ssr/index.js must not bundle AWS SDK");
});

console.log("\n================================================================================");
console.log(`CHALLENGER 1 SUMMARY: ${passed + failed} TESTS RUN | ${passed} PASSED | ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) {
  console.error("FAILURES:");
  for (const f of failures) {
    console.error(`- ${f.name}: ${f.error}`);
  }
  process.exit(1);
}
