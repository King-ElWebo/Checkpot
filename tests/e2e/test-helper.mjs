/**
 * Checkpot E2E Test Helper Utilities
 * Independent opaque-box test utilities using native Node.js and fetch.
 */

import { performance } from "node:perf_hooks";
import { createHmac } from "node:crypto";

export const DEFAULT_TARGET_URL = "http://localhost:3000";

/**
 * Resolve target base URL from environment or CLI
 */
export function getTargetUrl() {
  return (process.env.TEST_TARGET_URL || DEFAULT_TARGET_URL).replace(/\/$/, "");
}

/**
 * Make an HTTP request against the test target
 * Defaults to redirect: "manual" so redirects and 301/410 status codes can be asserted directly.
 */
export async function request(pathOrUrl, options = {}) {
  const baseUrl = getTargetUrl();
  const url = pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")
    ? pathOrUrl
    : `${baseUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

  const headers = new Headers(options.headers || {});

  // Add cookies if specified
  if (options.cookies) {
    if (typeof options.cookies === "string") {
      headers.set("Cookie", options.cookies);
    } else if (typeof options.cookies === "object") {
      const cookieStr = Object.entries(options.cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ");
      headers.set("Cookie", cookieStr);
    }
  }

  const fetchOptions = {
    method: options.method || "GET",
    headers,
    redirect: options.redirect || "manual", // Default to manual for redirect verification
  };

  if (options.body !== undefined) {
    fetchOptions.body = options.body;
  }

  const startTime = performance.now();
  let res;
  try {
    res = await fetch(url, fetchOptions);
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime);
    throw new Error(`Fetch failed for ${fetchOptions.method} ${url} after ${durationMs}ms: ${err.message}`);
  }
  const endTime = performance.now();
  const durationMs = Math.round(endTime - startTime);

  let bodyText = "";
  try {
    bodyText = await res.text();
  } catch {
    bodyText = "";
  }

  return {
    url,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    body: bodyText,
    durationMs,
    ok: res.ok,
    redirected: res.redirected,
    getHeader(name) {
      return res.headers.get(name);
    },
    json() {
      try {
        return JSON.parse(bodyText);
      } catch (err) {
        throw new Error(`Failed to parse JSON response from ${url}: ${err.message}. Response was:\n${bodyText.slice(0, 300)}`);
      }
    },
  };
}

/**
 * General Assertion
 */
export function assert(condition, message = "Assertion failed") {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Strict Equality Assertion
 */
export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

/**
 * Status Code Assertion
 */
export function assertStatus(response, expectedStatus, message) {
  if (response.status !== expectedStatus) {
    throw new Error(
      message ||
      `Expected status ${expectedStatus} for ${response.url} but got ${response.status} (${response.statusText}). Preview: ${response.body.slice(0, 200)}`
    );
  }
}

/**
 * Header Presence / Equality Assertion
 */
export function assertHeader(response, headerName, expectedValue, message) {
  const actual = response.headers.get(headerName);
  if (actual === null) {
    throw new Error(message || `Expected header "${headerName}" to be present on ${response.url}`);
  }
  if (expectedValue !== undefined && actual.toLowerCase() !== expectedValue.toLowerCase()) {
    throw new Error(
      message ||
      `Expected header "${headerName}" to be "${expectedValue}" on ${response.url}, but got "${actual}"`
    );
  }
}

/**
 * Header Substring Assertion
 */
export function assertHeaderIncludes(response, headerName, substring, message) {
  const actual = response.headers.get(headerName) || "";
  if (!actual.toLowerCase().includes(substring.toLowerCase())) {
    throw new Error(
      message ||
      `Expected header "${headerName}" to include "${substring}" on ${response.url}, but got "${actual}"`
    );
  }
}

/**
 * Header Regex Assertion
 */
export function assertHeaderMatches(response, headerName, regex, message) {
  const actual = response.headers.get(headerName) || "";
  if (!regex.test(actual)) {
    throw new Error(
      message ||
      `Expected header "${headerName}" ("${actual}") to match regex ${regex} on ${response.url}`
    );
  }
}

/**
 * Body Substring Inclusion Assertion
 */
export function assertBodyIncludes(responseOrBody, substring, message) {
  const text = typeof responseOrBody === "string" ? responseOrBody : responseOrBody.body;
  if (!text.includes(substring)) {
    throw new Error(
      message ||
      `Expected body to include "${substring}". Body preview: ${text.slice(0, 300)}...`
    );
  }
}

/**
 * Body Substring Exclusion Assertion
 */
export function assertBodyExcludes(responseOrBody, substring, message) {
  const text = typeof responseOrBody === "string" ? responseOrBody : responseOrBody.body;
  if (text.includes(substring)) {
    throw new Error(
      message ||
      `Expected body NOT to include "${substring}", but it was found.`
    );
  }
}

/**
 * Create a serialized checkpot_consent cookie value
 */
export function createConsentCookie(analytics = false, externalMedia = false) {
  const state = {
    version: 2,
    necessary: true,
    analytics: Boolean(analytics),
    externalMedia: Boolean(externalMedia),
    timestamp: new Date().toISOString(),
  };
  return `checkpot_consent=${encodeURIComponent(JSON.stringify(state))}`;
}

/**
 * Base64URL encode utility for token synthesis
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Create a synthetic signed admin session token for testing
 * Matches jose HS256 token structure:
 * header: { alg: "HS256" }
 * payload: { role: "admin", sub: "admin", iss: "customer-site-platform", aud: "customer-site-admin", ... }
 */
export function createTestAdminToken(secret = "checkpot-migration-test-secret-at-least-32-chars-long") {
  const header = { alg: "HS256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    role: "admin",
    sub: "admin",
    iss: "customer-site-platform",
    aud: "customer-site-admin",
    iat: now,
    exp: now + 60 * 60 * 8, // 8 hours
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${headerB64}.${payloadB64}`;

  const hmac = createHmac("sha256", secret);
  hmac.update(signatureInput);
  const sigB64 = hmac.digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signatureInput}.${sigB64}`;
}

/**
 * Extract HTML Meta tags
 */
export function extractMetaTags(html) {
  const metaRegex = /<meta\s+([^>]*?)>/gi;
  const metas = [];
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrString = match[1];
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9:-]+)=(?:"([^"]*)"|'([^']*)')/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2] !== undefined ? attrMatch[2] : attrMatch[3];
    }
    metas.push(attrs);
  }
  return metas;
}

/**
 * Extract HTML Image tags
 */
export function extractImages(html) {
  const imgRegex = /<img\s+([^>]*?)>/gi;
  const images = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const attrString = match[1];
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9:-]+)=(?:"([^"]*)"|'([^']*)')/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2] !== undefined ? attrMatch[2] : attrMatch[3];
    }
    images.push(attrs);
  }
  return images;
}

/**
 * Extract all links (<a href="...">)
 */
export function extractLinks(html) {
  const linkRegex = /<a\s+[^>]*?href=(?:"([^"]*)"|'([^']*)')[^>]*>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1] !== undefined ? match[1] : match[2]);
  }
  return links;
}
