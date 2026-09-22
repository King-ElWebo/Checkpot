#!/usr/bin/env node

/**
 * Checkpot Cloudflare Workers Migration E2E Test Runner
 * Dual-Track Opaque-Box Test Harness (Tiers 1-4)
 * Native Node.js ESM, zero external dependencies.
 */

import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { readdirSync } from "node:fs";

// ANSI colors
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const GRAY = "\x1b[90m";

// CLI Arguments parsing
function parseArgs(args) {
  const options = {
    target: process.env.TEST_TARGET_URL || "http://localhost:3000",
    tier: "all",
    filter: null,
    bail: false,
    json: false,
    verbose: false,
    dryRun: false,
    concurrency: 1,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--target" && args[i + 1]) {
      options.target = args[++i];
    } else if (arg.startsWith("--target=")) {
      options.target = arg.split("=")[1];
    } else if (arg === "--tier" && args[i + 1]) {
      options.tier = args[++i];
    } else if (arg.startsWith("--tier=")) {
      options.tier = arg.split("=")[1];
    } else if (arg === "--filter" && args[i + 1]) {
      options.filter = new RegExp(args[++i], "i");
    } else if (arg.startsWith("--filter=")) {
      options.filter = new RegExp(arg.split("=")[1], "i");
    } else if (arg === "--bail" || arg === "-b") {
      options.bail = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--concurrency" && args[i + 1]) {
      options.concurrency = parseInt(args[++i], 10) || 1;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
${BOLD}Checkpot Next.js 16 Cloudflare Workers Migration — E2E Test Runner${RESET}

${CYAN}Usage:${RESET}
  node scripts/e2e-runner.mjs [options]

${CYAN}Options:${RESET}
  --target <url>        Target server base URL (default: http://localhost:3000 or $TEST_TARGET_URL)
  --tier <1|2|3|4|all>  Select test tier to run (default: all)
  --filter <regex>      Filter tests by title or feature tag
  --bail, -b            Stop test execution immediately upon first failure
  --json                Output results in JSON format
  --verbose, -v         Display detailed logs and assertion messages
  --dry-run             List matching tests without executing them
  --help, -h            Show this help manual

${CYAN}Test Tiers:${RESET}
  Tier 1 - Feature Coverage: Isolated happy-path tests (>=5 tests per feature across 22 features)
  Tier 2 - Boundary & Corner Cases: Negative inputs, non-existent slugs, oversized uploads, 404s/410s
  Tier 3 - Cross-Feature Combinations: Pairwise interactions (Brands + Outfits, Consent + GA, Honeypot + Rate Limit)
  Tier 4 - Real-World Application Scenarios: 5 end-to-end full visitor, SEO, and admin journeys
`);
}

// Test Registry
class TestRegistry {
  constructor() {
    this.tests = [];
    this.suites = [];
    this.currentSuite = null;
    this.currentTier = 1;
    this.currentFeature = null;
  }

  setTier(tier) {
    this.currentTier = tier;
  }

  setFeature(featureId, featureName) {
    this.currentFeature = { id: featureId, name: featureName };
  }

  suite(title, fn) {
    const parentSuite = this.currentSuite;
    const suiteObj = {
      title,
      tier: this.currentTier,
      feature: this.currentFeature,
      parent: parentSuite,
    };
    this.currentSuite = suiteObj;
    this.suites.push(suiteObj);
    try {
      fn();
    } finally {
      this.currentSuite = parentSuite;
    }
  }

  test(title, fn, metadata = {}) {
    const testObj = {
      title,
      fn,
      suite: this.currentSuite,
      tier: metadata.tier || this.currentTier || (this.currentSuite ? this.currentSuite.tier : 1),
      featureId: metadata.featureId || (this.currentFeature ? this.currentFeature.id : null),
      featureName: metadata.featureName || (this.currentFeature ? this.currentFeature.name : null),
      metadata,
    };
    this.tests.push(testObj);
  }
}

export const registry = new TestRegistry();

export function setTier(tier) {
  registry.setTier(tier);
}

export function setFeature(id, name) {
  registry.setFeature(id, name);
}

export function suite(title, fn) {
  registry.suite(title, fn);
}

export function test(title, fn, metadata) {
  registry.test(title, fn, metadata);
}

// Execution Engine
async function runTests(options) {
  process.env.TEST_TARGET_URL = options.target;

  // Filter tests according to options
  let matchedTests = registry.tests.filter((t) => {
    if (options.tier !== "all" && String(t.tier) !== String(options.tier)) {
      return false;
    }
    if (options.filter) {
      const fullTitle = `${t.suite ? t.suite.title + " " : ""}${t.title} [F${t.featureId || ""}]`;
      if (!options.filter.test(fullTitle)) {
        return false;
      }
    }
    return true;
  });

  if (!options.json) {
    console.log(`${BOLD}${CYAN}=== Checkpot Cloudflare Migration E2E Test Suite ===${RESET}`);
    console.log(`${GRAY}Target:${RESET}    ${options.target}`);
    console.log(`${GRAY}Tier:${RESET}      ${options.tier}`);
    console.log(`${GRAY}Filter:${RESET}    ${options.filter ? options.filter.source : "none"}`);
    console.log(`${GRAY}Tests:${RESET}     ${matchedTests.length} registered\n`);
  }

  if (options.dryRun) {
    if (options.json) {
      console.log(JSON.stringify({ dryRun: true, count: matchedTests.length, tests: matchedTests.map(t => ({ title: t.title, tier: t.tier, feature: t.featureId })) }, null, 2));
      return 0;
    }
    console.log(`${YELLOW}DRY RUN MODE — Listing ${matchedTests.length} tests:${RESET}`);
    for (const t of matchedTests) {
      const suiteStr = t.suite ? `${t.suite.title} > ` : "";
      console.log(`  [Tier ${t.tier}] [F${t.featureId || "N/A"}] ${suiteStr}${t.title}`);
    }
    return 0;
  }

  const results = {
    total: matchedTests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    startTime: performance.now(),
    endTime: 0,
    durationMs: 0,
    tierBreakdown: { 1: { total: 0, passed: 0, failed: 0 }, 2: { total: 0, passed: 0, failed: 0 }, 3: { total: 0, passed: 0, failed: 0 }, 4: { total: 0, passed: 0, failed: 0 } },
    featureCoverage: {},
    failures: [],
    latencies: [],
  };

  for (let i = 1; i <= 22; i++) {
    results.featureCoverage[i] = { total: 0, passed: 0, failed: 0 };
  }

  // Execute sequentially or controlled
  for (let idx = 0; idx < matchedTests.length; idx++) {
    const t = matchedTests[idx];
    const tier = t.tier || 1;
    const fId = t.featureId;

    if (!results.tierBreakdown[tier]) {
      results.tierBreakdown[tier] = { total: 0, passed: 0, failed: 0 };
    }
    results.tierBreakdown[tier].total++;
    if (fId && results.featureCoverage[fId]) {
      results.featureCoverage[fId].total++;
    }

    const testStart = performance.now();
    let testPassed = false;
    let testError = null;

    try {
      await t.fn();
      testPassed = true;
      results.passed++;
      results.tierBreakdown[tier].passed++;
      if (fId && results.featureCoverage[fId]) {
        results.featureCoverage[fId].passed++;
      }
    } catch (err) {
      testPassed = false;
      testError = err;
      results.failed++;
      results.tierBreakdown[tier].failed++;
      if (fId && results.featureCoverage[fId]) {
        results.featureCoverage[fId].failed++;
      }
      results.failures.push({
        title: t.title,
        suite: t.suite ? t.suite.title : "",
        tier: t.tier,
        featureId: t.featureId,
        error: err.message,
        stack: err.stack,
      });
    }

    const testDuration = Math.round(performance.now() - testStart);
    results.latencies.push(testDuration);

    if (!options.json) {
      const symbol = testPassed ? `${GREEN}✔${RESET}` : `${RED}✖${RESET}`;
      const prefix = `${GRAY}[T${tier}|F${fId || "-"}]${RESET}`;
      const suiteStr = t.suite ? `${GRAY}${t.suite.title} >${RESET} ` : "";
      const timeStr = `${GRAY}(${testDuration}ms)${RESET}`;

      console.log(`  ${symbol} ${prefix} ${suiteStr}${t.title} ${timeStr}`);

      if (!testPassed && options.verbose && testError) {
        console.log(`     ${RED}Error: ${testError.message}${RESET}`);
      }

      if (!testPassed && options.bail) {
        console.log(`\n${RED}Bailing early after first failure (--bail enabled).${RESET}`);
        break;
      }
    }
  }

  results.endTime = performance.now();
  results.durationMs = Math.round(results.endTime - results.startTime);

  // Compute latency stats
  if (results.latencies.length > 0) {
    const sorted = [...results.latencies].sort((a, b) => a - b);
    results.stats = {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length),
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    // Console summary
    console.log(`\n${BOLD}${CYAN}=== Test Summary ===${RESET}`);
    console.log(`Total:    ${results.total}`);
    console.log(`Passed:   ${GREEN}${results.passed}${RESET}`);
    console.log(`Failed:   ${results.failed > 0 ? RED + results.failed + RESET : GREEN + "0" + RESET}`);
    console.log(`Duration: ${results.durationMs}ms`);

    if (results.stats) {
      console.log(`Latency:  min: ${results.stats.min}ms | avg: ${results.stats.avg}ms | p95: ${results.stats.p95}ms | max: ${results.stats.max}ms`);
    }

    console.log(`\n${BOLD}Tier Breakdown:${RESET}`);
    for (const [tier, data] of Object.entries(results.tierBreakdown)) {
      if (data.total > 0) {
        const statusStr = data.failed === 0 ? `${GREEN}${data.passed}/${data.total} passed${RESET}` : `${RED}${data.passed}/${data.total} passed (${data.failed} failed)${RESET}`;
        console.log(`  Tier ${tier}: ${statusStr}`);
      }
    }

    if (results.failures.length > 0) {
      console.log(`\n${BOLD}${RED}Failures (${results.failures.length}):${RESET}`);
      results.failures.slice(0, 10).forEach((f, idx) => {
        console.log(`\n  ${idx + 1}) [Tier ${f.tier}|F${f.featureId || "-"}] ${f.suite} > ${f.title}`);
        console.log(`     ${RED}${f.error}${RESET}`);
      });
      if (results.failures.length > 10) {
        console.log(`     ... and ${results.failures.length - 10} more failures.`);
      }
    }
  }

  return results.failed === 0 ? 0 : 1;
}

// Main loader
async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Load test suite files dynamically
  const testsDir = resolve(process.cwd(), "tests", "e2e");
  const testFiles = [
    "tier1-features.test.mjs",
    "tier2-boundaries.test.mjs",
    "tier3-combinations.test.mjs",
    "tier4-scenarios.test.mjs",
  ];

  for (const file of testFiles) {
    const fullPath = join(testsDir, file);
    try {
      const fileUrl = pathToFileURL(fullPath).href;
      await import(fileUrl);
    } catch (err) {
      console.error(`${RED}Error importing test file ${file}:${RESET}`, err);
      process.exit(2);
    }
  }

  const exitCode = await runTests(options);
  process.exit(exitCode);
}

// Run if executed directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(`${RED}Fatal runner error:${RESET}`, err);
    process.exit(2);
  });
}
