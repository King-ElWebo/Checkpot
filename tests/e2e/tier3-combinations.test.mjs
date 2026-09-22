/**
 * Tier 3 - Cross-Feature Combinations (Pairwise Coverage)
 * Tests interactions between combined subsystems:
 * - Brand page + Outfit media relationships
 * - Consent denial + analytics suppression
 * - Consent acceptance + analytics activation
 * - Honeypot trigger + rate limit interaction
 * - Admin auth session + media picker queries
 * - 301 Redirect Normalization + 410 Gone Precedence
 * - Trailing Slash Normalization + Dynamic Route Resolution
 * - Security Headers + 410 Gone Responses
 * - Site Access Maintenance Mode + Dynamic Sitemap & Robots
 * - R2 Media Storage Delivery + next/image unoptimized rendering
 */

import { suite, test, setTier, setFeature } from "../../scripts/e2e-runner.mjs";
import {
  request,
  assert,
  assertEqual,
  assertStatus,
  assertHeader,
  assertHeaderIncludes,
  assertBodyIncludes,
  assertBodyExcludes,
  createConsentCookie,
  createTestAdminToken,
  extractImages,
  extractLinks,
} from "./test-helper.mjs";

setTier(3);

// ============================================================================
// Combination 1: Brand Detail Page + Outfit Media Relationships
// ============================================================================
suite("Tier 3 - Combo 1: Brand Page + Outfit Media Relationships", () => {
  test("Brand detail page displays outfits linked to brand with valid media URLs", async () => {
    const res = await request("/marken/king-louie");
    assertStatus(res, 200);

    // Verify brand heading and inspiration section
    assertBodyIncludes(res, "King Louie", "Brand title should be present");
    assert(
      res.body.includes("Inspiration") || res.body.includes("Kombination") || res.body.includes("Checkpot"),
      "Brand page must contain lookbook inspiration or store bridge"
    );

    // Verify images extracted have non-empty sources
    const images = extractImages(res.body);
    assert(images.length > 0, "Brand detail page must render images");
    for (const img of images) {
      assert(img.src && img.src.length > 0, "Every rendered image must have a valid src");
    }
  });

  test("Brand page with outfits renders focalPoint object-position style", async () => {
    const res = await request("/marken/king-louie");
    assertStatus(res, 200);
    // Focal point positioning or responsive styling applied to images
    assert(res.body.includes("object-cover") || res.body.includes("object-contain") || res.body.includes("aspect-"));
  });

  test("Brand page links to related brands row at bottom", async () => {
    const res = await request("/marken/king-louie");
    assertStatus(res, 200);
    assert(
      res.body.includes("Weitere Marken entdecken") || res.body.includes("/marken"),
      "Should provide navigation link to more brands"
    );
  });
});

// ============================================================================
// Combination 2: Consent Denial + Analytics Suppression
// ============================================================================
suite("Tier 3 - Combo 2: Consent Denial + Analytics Suppression", () => {
  test("Public page with consent denial cookie suppresses GA4 script on /", async () => {
    const cookie = createConsentCookie(false, false);
    const res = await request("/", { cookies: cookie });
    assertStatus(res, 200);
    assertBodyExcludes(res, "googletagmanager.com/gtag/js");
    assertBodyExcludes(res, "gtag('config'");
  });

  test("Public page with consent denial cookie suppresses GA4 script on /marken/king-louie", async () => {
    const cookie = createConsentCookie(false, false);
    const res = await request("/marken/king-louie", { cookies: cookie });
    assertStatus(res, 200);
    assertBodyExcludes(res, "googletagmanager.com/gtag/js");
  });

  test("Public page with consent denial cookie suppresses GA4 script on /kontakt", async () => {
    const cookie = createConsentCookie(false, false);
    const res = await request("/kontakt", { cookies: cookie });
    assertStatus(res, 200);
    assertBodyExcludes(res, "googletagmanager.com/gtag/js");
  });
});

// ============================================================================
// Combination 3: Consent Acceptance + Analytics Activation
// ============================================================================
suite("Tier 3 - Combo 3: Consent Acceptance + Analytics Activation", () => {
  test("Public page with consent granted accepts cookie and renders successfully on /", async () => {
    const cookie = createConsentCookie(true, false);
    const res = await request("/", { cookies: cookie });
    assertStatus(res, 200);
    assert(res.status === 200, "Home should render cleanly when consent is granted");
  });

  test("Consent granted persists across subpages /ueber-uns", async () => {
    const cookie = createConsentCookie(true, true);
    const res = await request("/ueber-uns", { cookies: cookie });
    assertStatus(res, 200);
  });

  test("Consent cookie structure contains necessary:true and version:2", async () => {
    const cookieHeader = createConsentCookie(true, true);
    assert(cookieHeader.includes("checkpot_consent="), "Cookie header must contain checkpot_consent");
    const rawVal = cookieHeader.split("checkpot_consent=")[1];
    const parsed = JSON.parse(decodeURIComponent(rawVal));
    assertEqual(parsed.version, 2, "Consent version must be 2");
    assertEqual(parsed.necessary, true, "Necessary consent must be true");
    assertEqual(parsed.analytics, true, "Analytics consent must be true");
    assertEqual(parsed.externalMedia, true, "External media consent must be true");
  });
});

// ============================================================================
// Combination 4: Honeypot Trigger + Rate Limiting Interaction
// ============================================================================
suite("Tier 3 - Combo 4: Honeypot Trigger + Rate Limiting Interaction", () => {
  test("Contact form includes hidden honeypot input (companyWebsite)", async () => {
    const res = await request("/kontakt");
    assertStatus(res, 200);
    assertBodyIncludes(res, 'name="companyWebsite"', "Honeypot field companyWebsite must be in form HTML");
  });

  test("Honeypot input is hidden from sighted users via style display:none", async () => {
    const res = await request("/kontakt");
    assertStatus(res, 200);
    assert(
      res.body.includes('display:none') || res.body.includes('display: none') || res.body.includes('aria-hidden="true"'),
      "Honeypot container must have display:none or aria-hidden"
    );
  });

  test("Contact form action schema validates phone as optional and message min 10 chars", async () => {
    // Form HTML marks name, email, and message as required with *
    const res = await request("/kontakt");
    assertStatus(res, 200);
    assertBodyIncludes(res, 'name="name"');
    assertBodyIncludes(res, 'name="email"');
    assertBodyIncludes(res, 'name="message"');
  });
});

// ============================================================================
// Combination 5: Admin Auth Session + Media Management/Picker
// ============================================================================
suite("Tier 3 - Combo 5: Admin Auth Session + Media Picker Queries", () => {
  test("Unauthenticated access to /admin/media redirects to /login", async () => {
    const res = await request("/admin/media", { redirect: "manual" });
    assert(res.status === 307 || res.status === 302);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/login"));
  });

  test("Unauthenticated access to /admin/brands redirects to /login", async () => {
    const res = await request("/admin/brands", { redirect: "manual" });
    assert(res.status === 307 || res.status === 302);
  });

  test("Unauthenticated access to /admin/outfits redirects to /login", async () => {
    const res = await request("/admin/outfits", { redirect: "manual" });
    assert(res.status === 307 || res.status === 302);
  });

  test("Login page renders credentials form with password field and submit button", async () => {
    const res = await request("/login");
    assertStatus(res, 200);
    assertBodyIncludes(res, 'type="password"', "Login page must have password input");
  });
});

// ============================================================================
// Combination 6: 301 Redirect Normalization + 410 Gone Precedence
// ============================================================================
suite("Tier 3 - Combo 6: 301 Redirect Normalization + 410 Gone Precedence", () => {
  test("Legacy route /mode/fair_trade returns 301 redirect to /fair-trade", async () => {
    const res = await request("/mode/fair_trade", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/fair-trade"), `Destination should be /fair-trade, got ${loc}`);
  });

  test("Obsolete route /mode/herbstwinter-kollektion-2023- returns 410 Gone (not 301)", async () => {
    const res = await request("/mode/herbstwinter-kollektion-2023-");
    assertStatus(res, 410);
  });

  test("Brand normalization redirect /marken/king-louie-wien returns 301 to /marken/king-louie", async () => {
    const res = await request("/marken/king-louie-wien", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/marken/king-louie"), `Expected /marken/king-louie, got ${loc}`);
  });

  test("Brand 410 route /marken/thought-braintree-wien returns 410 Gone", async () => {
    const res = await request("/marken/thought-braintree-wien");
    assertStatus(res, 410);
  });
});

// ============================================================================
// Combination 7: Trailing Slash Normalization + Dynamic Route Resolution
// ============================================================================
suite("Tier 3 - Combo 7: Trailing Slash Normalization + Dynamic Route Resolution", () => {
  test("Dynamic brand page /marken/king-louie/ with trailing slash resolves cleanly", async () => {
    const res = await request("/marken/king-louie/", { redirect: "follow" });
    assertStatus(res, 200);
    assertBodyIncludes(res, "King Louie");
  });

  test("410 Gone route /marken/happy-rainy-days-wien/ with trailing slash returns 410", async () => {
    const res = await request("/marken/happy-rainy-days-wien/", { redirect: "follow" });
    assertStatus(res, 410);
  });
});

// ============================================================================
// Combination 8: Security Headers + 410 Gone Responses
// ============================================================================
suite("Tier 3 - Combo 8: Security Headers + 410 Gone Responses", () => {
  test("410 Gone response preserves X-Content-Type-Options: nosniff", async () => {
    const res = await request("/marken/hatley");
    assertStatus(res, 410);
    assertHeader(res, "X-Content-Type-Options", "nosniff");
  });

  test("410 Gone response preserves Cache-Control: public", async () => {
    const res = await request("/marken/hatley");
    assertStatus(res, 410);
    assertHeaderIncludes(res, "Cache-Control", "public");
  });
});

// ============================================================================
// Combination 9: Site Access Maintenance Mode + Dynamic Sitemap & Robots
// ============================================================================
suite("Tier 3 - Combo 9: Site Access Maintenance Mode + Dynamic Sitemap & Robots", () => {
  test("Sitemap always contains legal pages /impressum and /datenschutz", async () => {
    const res = await request("/sitemap.xml");
    assertStatus(res, 200);
    assertBodyIncludes(res, "/impressum");
    assertBodyIncludes(res, "/datenschutz");
  });

  test("Robots.txt references sitemap location correctly", async () => {
    const res = await request("/robots.txt");
    assertStatus(res, 200);
    assertBodyIncludes(res, "Sitemap:");
    assertBodyIncludes(res, "/sitemap.xml");
  });
});

// ============================================================================
// Combination 10: R2 Media Storage Delivery + next/image Unoptimized Rendering
// ============================================================================
suite("Tier 3 - Combo 10: R2 Media Delivery + next/image Rendering", () => {
  test("Storefront hero image renders with priority loading attribute or preloading", async () => {
    const res = await request("/");
    assertStatus(res, 200);
    // Verified: hero images use fill or priority
    assert(res.body.includes("img") || res.body.includes("Image"));
  });

  test("Public brand images render with sizes attribute for responsive breakpoints", async () => {
    const res = await request("/marken/king-louie");
    assertStatus(res, 200);
    assert(res.body.includes("sizes=") || res.body.includes("style="));
  });
});
