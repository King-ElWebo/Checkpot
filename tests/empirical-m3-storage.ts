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

console.log("==================================================");
console.log("RUNNING EMPIRICAL STORAGE TEST SUITE (M3)");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

async function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    testsPassed++;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[FAIL] ${name}:`, message);
    testsFailed++;
  }
}

// 1. extractStorageKey
await runTest("extractStorageKey handles relative paths and leading slashes", () => {
  assert.equal(extractStorageKey("media/test.jpg"), "media/test.jpg");
  assert.equal(extractStorageKey("/media/test.jpg"), "media/test.jpg");
  assert.equal(extractStorageKey("///store/entrance.jpg"), "store/entrance.jpg");
});

await runTest("extractStorageKey extracts pathname from full URLs", () => {
  assert.equal(
    extractStorageKey("https://media.checkpot.at/media/123e4567-e89b-12d3-a456-426614174000.jpg"),
    "media/123e4567-e89b-12d3-a456-426614174000.jpg"
  );
  assert.equal(
    extractStorageKey("https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg"),
    "store/checkpot-storefront-entrance.jpg"
  );
  assert.equal(
    extractStorageKey("https://pub-abc123xyz.r2.dev/outfits/look1.webp"),
    "outfits/look1.webp"
  );
});

// 2. getPublicUrlPrefix & getPublicUrl
await runTest("getPublicUrlPrefix defaults to https://media.checkpot.at", () => {
  const orig = process.env.R2_PUBLIC_URL_PREFIX;
  delete process.env.R2_PUBLIC_URL_PREFIX;
  delete process.env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX;
  delete process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;

  assert.equal(getPublicUrlPrefix(), "https://media.checkpot.at");
  if (orig) process.env.R2_PUBLIC_URL_PREFIX = orig;
});

await runTest("getPublicUrl generates correct public URL without duplicate slashes", () => {
  const url = getPublicUrl("media/abc-123.jpg");
  assert.equal(url, "https://media.checkpot.at/media/abc-123.jpg");

  const urlWithSlash = getPublicUrl("/media/abc-123.jpg");
  assert.equal(urlWithSlash, "https://media.checkpot.at/media/abc-123.jpg");
});

// 3. Storefront image resolution & fallbacks
await runTest("Storefront image resolves to R2 default domain", () => {
  assert.ok(STOREFRONT_IMAGE_URL.includes("store/checkpot-storefront-entrance.jpg"));
  assert.equal(STOREFRONT_IMAGE_URL, "https://media.checkpot.at/store/checkpot-storefront-entrance.jpg");
});

await runTest("Storefront image supports local fallback flag", () => {
  process.env.NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE = "true";
  const localUrl = getStorefrontImageUrl();
  assert.equal(localUrl, LOCAL_STOREFRONT_IMAGE_FALLBACK);
  delete process.env.NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE;
});

await runTest("Storefront image supports legacy blob fallback flag", () => {
  process.env.NEXT_PUBLIC_USE_LEGACY_BLOB = "true";
  const legacyUrl = getStorefrontImageUrl();
  assert.equal(legacyUrl, LEGACY_BLOB_STOREFRONT_IMAGE_URL);
  delete process.env.NEXT_PUBLIC_USE_LEGACY_BLOB;
});

// 4. uploadFile & deleteFile with local development fallback
await runTest("uploadFile executes graceful dev fallback when MEDIA_BUCKET is absent", async () => {
  const env = process.env as Record<string, string | undefined>;
  const originalEnv = env.NODE_ENV;
  env.NODE_ENV = "development";

  const testData = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
  const result = await uploadFile("media/unit-test.jpg", testData, {
    contentType: "image/jpeg",
  });

  assert.equal(result.key, "media/unit-test.jpg");
  assert.equal(result.url, "https://media.checkpot.at/media/unit-test.jpg");

  env.NODE_ENV = originalEnv;
});

await runTest("deleteFile executes graceful dev fallback when MEDIA_BUCKET is absent", async () => {
  const env = process.env as Record<string, string | undefined>;
  const originalEnv = env.NODE_ENV;
  env.NODE_ENV = "development";

  await deleteFile("media/unit-test.jpg");
  await deleteFile("https://media.checkpot.at/media/unit-test.jpg");

  env.NODE_ENV = originalEnv;
});

// 5. uploadFile & deleteFile with genuine R2 binding mock
await runTest("uploadFile and deleteFile interact correctly with R2Bucket binding", async () => {
  interface MockPutCall {
    key: string;
    options?: {
      httpMetadata?: {
        contentType?: string;
        cacheControl?: string;
      };
    };
  }

  const recorded: {
    putCall: MockPutCall | null;
    deleteKey: string | null;
  } = {
    putCall: null,
    deleteKey: null,
  };

  const mockBucket = {
    async put(key: string, _value: unknown, options?: MockPutCall["options"]) {
      recorded.putCall = { key, options };
      return null;
    },
    async delete(key: string) {
      recorded.deleteKey = key;
    },
  };

  const globalScope = globalThis as unknown as { MEDIA_BUCKET?: typeof mockBucket };
  globalScope.MEDIA_BUCKET = mockBucket;

  const testBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
  const uploadRes = await uploadFile("media/r2-live-test.png", testBytes, {
    contentType: "image/png",
    cacheControl: "public, max-age=31536000, immutable",
  });

  assert.equal(uploadRes.key, "media/r2-live-test.png");
  assert.equal(uploadRes.url, "https://media.checkpot.at/media/r2-live-test.png");
  
  const putCall = recorded.putCall;
  if (!putCall) {
    throw new Error("Expected putCall to be recorded by mock bucket");
  }
  assert.equal(putCall.key, "media/r2-live-test.png");
  assert.equal(putCall.options?.httpMetadata?.contentType, "image/png");
  assert.equal(putCall.options?.httpMetadata?.cacheControl, "public, max-age=31536000, immutable");

  await deleteFile("https://media.checkpot.at/media/r2-live-test.png");
  assert.equal(recorded.deleteKey, "media/r2-live-test.png");

  delete globalScope.MEDIA_BUCKET;
});

// 6. Zero @vercel/blob dependency in package.json and zero imports in src/
await runTest("package.json does not contain @vercel/blob", () => {
  const pkgContent = fs.readFileSync(path.join(rootDir, "package.json"), "utf8");
  const pkg = JSON.parse(pkgContent);
  assert.equal(pkg.dependencies?.["@vercel/blob"], undefined, "@vercel/blob must not be in dependencies");
  assert.equal(pkg.devDependencies?.["@vercel/blob"], undefined, "@vercel/blob must not be in devDependencies");
});

await runTest("Zero @vercel/blob imports exist in src/", () => {
  function scanDir(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...scanDir(fullPath));
      } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
        const text = fs.readFileSync(fullPath, "utf8");
        if (text.includes("@vercel/blob")) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  const offendingFiles = scanDir(path.join(rootDir, "src"));
  assert.deepEqual(offendingFiles, [], `Found lingering @vercel/blob imports in: ${offendingFiles.join(", ")}`);
});

// 7. next.config.ts verification
await runTest("next.config.ts has unoptimized: true and includes R2 remotePatterns", () => {
  const nextConfigContent = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
  assert.ok(nextConfigContent.includes("unoptimized: true"), "next.config.ts must set images.unoptimized: true");
  assert.ok(nextConfigContent.includes("media.checkpot.at"), "next.config.ts must include media.checkpot.at");
  assert.ok(nextConfigContent.includes("*.r2.dev"), "next.config.ts must include *.r2.dev");
  assert.ok(nextConfigContent.includes("*.cloudflarestorage.com"), "next.config.ts must include *.cloudflarestorage.com");
  assert.ok(nextConfigContent.includes("*.public.blob.vercel-storage.com"), "next.config.ts must retain *.public.blob.vercel-storage.com");
});

// 8. Public pages storefront normalization
await runTest("Storefront images in public pages use STOREFRONT_IMAGE_URL", () => {
  const pageTsx = fs.readFileSync(path.join(rootDir, "src/app/(public)/page.tsx"), "utf8");
  const ueberUnsTsx = fs.readFileSync(path.join(rootDir, "src/app/(public)/ueber-uns/page.tsx"), "utf8");
  const kontaktTsx = fs.readFileSync(path.join(rootDir, "src/app/(public)/kontakt/page.tsx"), "utf8");

  assert.ok(!pageTsx.includes("https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/"), "page.tsx must not hardcode vercel blob URL");
  assert.ok(pageTsx.includes("src={STOREFRONT_IMAGE_URL}"), "page.tsx must use STOREFRONT_IMAGE_URL");

  assert.ok(!ueberUnsTsx.includes("https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/"), "ueber-uns must not hardcode vercel blob URL");
  assert.ok(ueberUnsTsx.includes("src={STOREFRONT_IMAGE_URL}"), "ueber-uns must use STOREFRONT_IMAGE_URL");

  assert.ok(!kontaktTsx.includes("https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/"), "kontakt must not hardcode vercel blob URL");
  assert.ok(kontaktTsx.includes("src={STOREFRONT_IMAGE_URL}"), "kontakt must use STOREFRONT_IMAGE_URL");
});

console.log("==================================================");
console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log("==================================================");

if (testsFailed > 0) {
  process.exit(1);
}
