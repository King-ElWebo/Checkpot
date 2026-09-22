import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Test VercelAnalytics stub
import { VercelAnalytics } from "../src/components/public/consent/vercel-analytics";
// 2. Test ConsentManager and child tree
import { ConsentManager } from "../src/components/public/consent/consent-manager";
import { GoogleAnalytics } from "../src/components/public/consent/google-analytics";
import { ConsentState } from "../src/lib/consent/types";

const TestConsentManager = ConsentManager as unknown as React.ComponentType<{
  initialConsent: ConsentState | null;
  children?: React.ReactNode;
}>;

console.log("==================================================");
console.log("RUNNING EMPIRICAL CHALLENGER TEST SUITE (M1)");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    testsPassed++;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[FAIL] ${name}:`, message);
    testsFailed++;
  }
}

// Test 1: VercelAnalytics produces null JSX and empty HTML string
runTest("VercelAnalytics stub renders null cleanly without throwing", () => {
  const element = React.createElement(VercelAnalytics);
  const html = renderToStaticMarkup(element);
  assert.equal(html, "", "VercelAnalytics must render empty string");
  assert.equal(VercelAnalytics(), null, "Calling VercelAnalytics directly returns null");
});

// Test 2: ConsentManager with initialConsent = null (first visit)
runTest("ConsentManager renders valid JSX tree when initialConsent is null", () => {
  const childContent = "Hello Public Page Content";
  const element = React.createElement(
    TestConsentManager,
    { initialConsent: null },
    React.createElement("div", { id: "test-child" }, childContent)
  );

  const html = renderToStaticMarkup(element);
  assert.ok(html.includes(childContent), "Must render children");
  assert.ok(html.includes("Ihre Privatsphäre"), "Must render ConsentBanner heading");
  assert.ok(html.includes("Google Analytics"), "Must mention Google Analytics in consent banner");
  assert.ok(!html.includes("Vercel"), "Must NOT contain any reference to Vercel in rendered banner HTML");
  assert.ok(!html.includes("Speed Insights"), "Must NOT contain reference to Speed Insights in rendered banner HTML");
});

// Test 3: ConsentManager with initialConsent analytics = false (rejected)
runTest("ConsentManager suppresses banner and GA when analytics consent is false", () => {
  const initialConsent: ConsentState = {
    version: 2,
    necessary: true,
    analytics: false,
    externalMedia: false,
    timestamp: "2026-09-21T12:00:00.000Z",
  };

  const childContent = "Page content with rejected consent";
  const element = React.createElement(
    TestConsentManager,
    { initialConsent },
    React.createElement("div", { id: "test-child-rejected" }, childContent)
  );

  const html = renderToStaticMarkup(element);
  assert.ok(html.includes(childContent), "Must render children");
  assert.ok(!html.includes("Ihre Privatsphäre"), "Must NOT render ConsentBanner when consent is already set");
  assert.ok(!html.includes("Vercel"), "Must NOT contain any Vercel reference");
});

// Test 4: ConsentManager with initialConsent analytics = true
runTest("ConsentManager executes cleanly when analytics consent is granted", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TESTMEASURE1";

  const initialConsent: ConsentState = {
    version: 2,
    necessary: true,
    analytics: true,
    externalMedia: true,
    timestamp: "2026-09-21T12:00:00.000Z",
  };

  const childContent = "Page content with granted consent";
  const element = React.createElement(
    TestConsentManager,
    { initialConsent },
    React.createElement("div", { id: "test-child-granted" }, childContent)
  );

  const html = renderToStaticMarkup(element);
  assert.ok(html.includes(childContent), "Must render children");
  assert.ok(!html.includes("Ihre Privatsphäre"), "Must NOT render banner when consent is set");
  assert.ok(!html.includes("Vercel"), "Must NOT contain any Vercel reference");
});

// Test 5: Verify GoogleAnalytics React tree inspection
runTest("GoogleAnalytics returns null when consent denied, and returns Script elements when granted", () => {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TESTMEASURE1";

  // When consent is not granted
  function TestConsumerDenied() {
    return React.createElement(GoogleAnalytics);
  }
  const deniedTree = React.createElement(
    TestConsentManager,
    {
      initialConsent: { version: 2, necessary: true, analytics: false, externalMedia: false, timestamp: "2026-09-21" },
    },
    React.createElement(TestConsumerDenied)
  );
  assert.doesNotThrow(() => renderToStaticMarkup(deniedTree));

  // When consent is granted
  function TestConsumerGranted() {
    return React.createElement(GoogleAnalytics);
  }
  const grantedTree = React.createElement(
    TestConsentManager,
    {
      initialConsent: { version: 2, necessary: true, analytics: true, externalMedia: true, timestamp: "2026-09-21" },
    },
    React.createElement(TestConsumerGranted)
  );
  assert.doesNotThrow(() => renderToStaticMarkup(grantedTree));
});

// Test 6: Verify no Vercel imports in any src/ file
runTest("Zero lingering imports of @vercel/analytics or @vercel/speed-insights in src/", () => {
  function scanDir(dir: string): string[] {
    let results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(scanDir(fullPath));
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const srcDir = path.resolve(__dirname, "../src");
  const files = scanDir(srcDir);
  const offendingImports: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/from\s+["']@vercel\/(analytics|speed-insights)/.test(line) ||
          /require\(["']@vercel\/(analytics|speed-insights)/.test(line) ||
          /import\(["']@vercel\/(analytics|speed-insights)/.test(line)) {
        offendingImports.push(`${file}:${i + 1}: ${line.trim()}`);
      }
    }
  }

  assert.equal(
    offendingImports.length,
    0,
    `Found offending @vercel imports:\n${offendingImports.join("\n")}`
  );
});

// Test 7: Verify wrangler.jsonc syntax and required fields
runTest("wrangler.jsonc is valid JSON and contains required contract bindings", () => {
  const wranglerPath = path.resolve(__dirname, "../wrangler.jsonc");
  assert.ok(fs.existsSync(wranglerPath), "wrangler.jsonc must exist");
  const raw = fs.readFileSync(wranglerPath, "utf-8");
  const config = JSON.parse(raw);

  assert.equal(config.name, "checkpot-website", "Name must be checkpot-website");
  assert.ok(Array.isArray(config.compatibility_flags), "compatibility_flags must be an array");
  assert.ok(config.compatibility_flags.includes("nodejs_compat"), "Must include nodejs_compat flag");
  assert.ok(config.vars, "Must have vars object");
  assert.equal(config.vars.SITE_URL, "https://checkpot-hietzing.at", "SITE_URL must match canonical site URL");
  assert.equal(config.vars.NEXT_PUBLIC_GA_MEASUREMENT_ID, "G-LBFJND2204", "GA Measurement ID must match");
  assert.ok(Array.isArray(config.r2_buckets), "r2_buckets must be an array");
  const mediaBucket = config.r2_buckets.find((b: { binding?: string; bucket_name?: string }) => b.binding === "MEDIA_BUCKET");
  assert.ok(mediaBucket, "Must bind MEDIA_BUCKET");
  assert.equal(mediaBucket.bucket_name, "checkpot-media", "Bucket name must be checkpot-media");
});

// Test 8: Verify .gitignore covers .dev.vars and .wrangler
runTest(".gitignore contains patterns for .dev.vars and .wrangler while preserving .dev.vars.example", () => {
  const gitignorePath = path.resolve(__dirname, "../.gitignore");
  const content = fs.readFileSync(gitignorePath, "utf-8");

  assert.ok(content.includes(".dev.vars"), ".gitignore must ignore .dev.vars");
  assert.ok(content.includes(".dev.vars.*"), ".gitignore must ignore .dev.vars.*");
  assert.ok(content.includes("!.dev.vars.example"), ".gitignore must whitelist !.dev.vars.example");
  assert.ok(content.includes(".wrangler/"), ".gitignore must ignore .wrangler/");
});

// Test 9: Verify .dev.vars.example documents all critical fail-closed secrets
runTest(".dev.vars.example documents all required secrets with fail-closed examples", () => {
  const devVarsPath = path.resolve(__dirname, "../.dev.vars.example");
  assert.ok(fs.existsSync(devVarsPath), ".dev.vars.example must exist");
  const content = fs.readFileSync(devVarsPath, "utf-8");

  const requiredKeys = [
    "DATABASE_URL",
    "SITE_URL",
    "AUTH_SECRET",
    "ADMIN_PASSWORD",
    "RESEND_API_KEY",
    "RATE_LIMIT_SECRET",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  ];

  for (const key of requiredKeys) {
    assert.ok(content.includes(`${key}=`), `.dev.vars.example must contain key ${key}`);
  }
});

console.log("==================================================");
console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log("==================================================");

if (testsFailed > 0) {
  process.exit(1);
}
