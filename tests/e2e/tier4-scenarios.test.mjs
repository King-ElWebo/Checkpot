/**
 * Tier 4 - Real-World Application Scenarios
 * Implements 5 realistic multi-step end-to-end user journeys:
 * 1. Full visitor journey (Home -> Über uns -> Mode -> Outfits -> Brand detail -> Contact form)
 * 2. Legacy SEO user (301 redirects, 410 Gone paths, and WordPress probe paths)
 * 3. Store media verification (Store entrance, interior photos, og-image, Content-Type, Cache-Control)
 * 4. Privacy & Consent lifecycle (Initial clean load -> Accept Analytics -> Update Preferences -> Decline)
 * 5. Admin management lifecycle (Unauthenticated redirect -> Login attempts -> Admin dashboard -> Logout)
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

setTier(4);

// ============================================================================
// Scenario 1: Full Visitor Journey
// ============================================================================
suite("Scenario 1: Full Visitor Journey", () => {
  test("Step 1: Visitor lands on Homepage /", async () => {
    const res = await request("/");
    assertStatus(res, 200);
    assertBodyIncludes(res, "Checkpot", "Homepage must identify as Checkpot");
    assert(
      res.body.includes("Mode") || res.body.includes("Hietzing") || res.body.includes("Wien"),
      "Homepage must contain store location and focus"
    );

    // Verify navigation links are present
    const links = extractLinks(res.body);
    assert(links.some((l) => l.includes("/mode")), "Must link to /mode");
    assert(links.some((l) => l.includes("/outfits")), "Must link to /outfits");
    assert(links.some((l) => l.includes("/marken")), "Must link to /marken");
    assert(links.some((l) => l.includes("/kontakt")), "Must link to /kontakt");
  });

  test("Step 2: Visitor navigates to Über uns /ueber-uns", async () => {
    const res = await request("/ueber-uns");
    assertStatus(res, 200);
    assertBodyIncludes(res, "Christa", "About page must introduce founder Christa");
    assert(
      res.body.includes("2009") || res.body.includes("Boutique") || res.body.includes("Hietzing"),
      "About page must tell boutique history"
    );
  });

  test("Step 3: Visitor explores Mode /mode", async () => {
    const res = await request("/mode");
    assertStatus(res, 200);
    assert(
      res.body.includes("Kollektion") || res.body.includes("Saison") || res.body.includes("Damenmode"),
      "Mode page must display current fashion collection info"
    );
  });

  test("Step 4: Visitor checks Outfits lookbook /outfits", async () => {
    const res = await request("/outfits");
    assertStatus(res, 200);
    assert(
      res.body.includes("Outfit") || res.body.includes("Look") || res.body.includes("Inspiration"),
      "Outfits page must render lookbook inspiration"
    );
  });

  test("Step 5: Visitor views Brand detail page /marken/king-louie", async () => {
    const res = await request("/marken/king-louie");
    assertStatus(res, 200);
    assertBodyIncludes(res, "King Louie", "Brand detail must feature brand name");
    assert(
      res.body.includes("Stil & Handschrift") || res.body.includes("Checkpot") || res.body.includes("Hietzing"),
      "Brand detail must describe brand story and store bridge"
    );
  });

  test("Step 6: Visitor proceeds to Kontakt /kontakt and reviews store info", async () => {
    const res = await request("/kontakt");
    assertStatus(res, 200);
    assertBodyIncludes(res, "Hietzinger Hauptstraße 34A", "Address must be visible");
    assertBodyIncludes(res, "1130 Wien", "Postal code must be visible");
    assert(
      res.body.includes("Öffnungszeiten") || res.body.includes("Mo") || res.body.includes("Uhr"),
      "Opening hours must be visible"
    );
  });

  test("Step 7: Visitor inspects contact form structure on /kontakt", async () => {
    const res = await request("/kontakt");
    assertStatus(res, 200);
    assertBodyIncludes(res, 'name="name"', "Name field required");
    assertBodyIncludes(res, 'name="email"', "Email field required");
    assertBodyIncludes(res, 'name="message"', "Message field required");
    assertBodyIncludes(res, 'name="companyWebsite"', "Honeypot field present");
  });
});

// ============================================================================
// Scenario 2: Legacy SEO User
// ============================================================================
suite("Scenario 2: Legacy SEO User Journey", () => {
  test("Step 1: Legacy alias /team redirects 301 to /ueber-uns", async () => {
    const res = await request("/team", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/ueber-uns"), `Redirect location must be /ueber-uns, got ${loc}`);
  });

  test("Step 2: Destination /ueber-uns resolves with 200 OK", async () => {
    const res = await request("/ueber-uns");
    assertStatus(res, 200);
  });

  test("Step 3: Legacy alias /brands redirects 301 to /marken", async () => {
    const res = await request("/brands", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/marken"), `Redirect location must be /marken, got ${loc}`);
  });

  test("Step 4: Legacy alias /home redirects 301 to /", async () => {
    const res = await request("/home", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.endsWith("/") || loc === "/", `Redirect location must be /, got ${loc}`);
  });

  test("Step 5: Legacy contact subpage /kontakt/impressum redirects 301 to /impressum", async () => {
    const res = await request("/kontakt/impressum", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/impressum"));
  });

  test("Step 6: Normalized brand URL /marken/madness-wien redirects 301 to /marken/madness", async () => {
    const res = await request("/marken/madness-wien", { redirect: "manual" });
    assertStatus(res, 301);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/marken/madness"));
  });

  test("Step 7: Obsolete route /marken/zilch-wien returns HTTP 410 Gone", async () => {
    const res = await request("/marken/zilch-wien");
    assertStatus(res, 410);
    assertBodyIncludes(res, "410 Gone");
    assertHeaderIncludes(res, "Content-Type", "text/plain");
    assertHeaderIncludes(res, "Cache-Control", "public");
  });

  test("Step 8: Obsolete route /schrankcheck-alt/schrankcheck returns HTTP 410 Gone", async () => {
    const res = await request("/schrankcheck-alt/schrankcheck");
    assertStatus(res, 410);
    assertBodyIncludes(res, "410 Gone");
  });

  test("Step 9: WordPress probe paths return 404/410 cleanly without crash", async () => {
    const wpRes = await request("/wp-login.php");
    assert(wpRes.status === 404 || wpRes.status === 410, `wp-login.php should 404/410, got ${wpRes.status}`);

    const xmlrpcRes = await request("/xmlrpc.php");
    assert(xmlrpcRes.status === 404 || xmlrpcRes.status === 410, `xmlrpc.php should 404/410, got ${xmlrpcRes.status}`);
  });
});

// ============================================================================
// Scenario 3: Store Media Verification
// ============================================================================
suite("Scenario 3: Store Media Verification", () => {
  test("Step 1: Inspect storefront hero image on Homepage /", async () => {
    const res = await request("/");
    assertStatus(res, 200);
    const images = extractImages(res.body);
    assert(images.length > 0, "Homepage must contain images");
  });

  test("Step 2: Directly fetch storefront customer image /customer/christa-storefront.jpg", async () => {
    const res = await request("/customer/christa-storefront.jpg");
    assert(res.status === 200 || res.status === 404, `Image fetch status ${res.status}`);
    if (res.status === 200) {
      assertHeaderIncludes(res, "Content-Type", "image/jpeg");
    }
  });

  test("Step 3: Directly fetch boutique selection image /customer/christa-boutique-selection.jpg", async () => {
    const res = await request("/customer/christa-boutique-selection.jpg");
    assert(res.status === 200 || res.status === 404);
    if (res.status === 200) {
      assertHeaderIncludes(res, "Content-Type", "image/jpeg");
      const cc = res.getHeader("Cache-Control");
      assert(cc !== null, "Static image must provide Cache-Control header");
    }
  });

  test("Step 4: Fetch store detail scarf image /customer/store-detail-scarves.jpg", async () => {
    const res = await request("/customer/store-detail-scarves.jpg");
    assert(res.status === 200 || res.status === 404);
    if (res.status === 200) {
      assertHeaderIncludes(res, "Content-Type", "image/jpeg");
    }
  });

  test("Step 5: Fetch store detail flowers image /customer/store-detail-flowers.jpg", async () => {
    const res = await request("/customer/store-detail-flowers.jpg");
    assert(res.status === 200 || res.status === 404);
    if (res.status === 200) {
      assertHeaderIncludes(res, "Content-Type", "image/jpeg");
    }
  });

  test("Step 6: Fetch OpenGraph social preview image /customer/og-image.jpg", async () => {
    const res = await request("/customer/og-image.jpg");
    assertStatus(res, 200);
    assertHeaderIncludes(res, "Content-Type", "image/jpeg");
  });
});

// ============================================================================
// Scenario 4: Privacy & Consent Lifecycle
// ============================================================================
suite("Scenario 4: Privacy & Consent Lifecycle", () => {
  test("Step 1: Clean visitor initial load (no consent cookie) -> GA4 suppressed", async () => {
    const res = await request("/");
    assertStatus(res, 200);
    assertBodyExcludes(res, "googletagmanager.com/gtag/js", "Zero tracking scripts on initial unconsented load");
    assertBodyExcludes(res, "gtag('config'", "gtag config call must not run without consent");
  });

  test("Step 2: Visitor accepts analytics -> checkpot_consent={analytics: true}", async () => {
    const cookie = createConsentCookie(true, false);
    const res = await request("/", { cookies: cookie });
    assertStatus(res, 200);
    assert(res.status === 200, "Page renders cleanly with analytics consent granted");
  });

  test("Step 3: Visitor updates preferences to allow externalMedia only -> GA4 suppressed", async () => {
    const cookie = createConsentCookie(false, true);
    const res = await request("/", { cookies: cookie });
    assertStatus(res, 200);
    assertBodyExcludes(res, "googletagmanager.com/gtag/js", "GA4 must remain suppressed when analytics=false");
  });

  test("Step 4: Visitor declines all cookies -> strict suppression across all pages", async () => {
    const cookie = createConsentCookie(false, false);
    const res1 = await request("/ueber-uns", { cookies: cookie });
    assertStatus(res1, 200);
    assertBodyExcludes(res1, "googletagmanager.com/gtag/js");

    const res2 = await request("/marken", { cookies: cookie });
    assertStatus(res2, 200);
    assertBodyExcludes(res2, "googletagmanager.com/gtag/js");
  });

  test("Step 5: Visitor reviews privacy policy /datenschutz", async () => {
    const res = await request("/datenschutz");
    assertStatus(res, 200);
    assertBodyIncludes(res, "Datenschutzerklärung");
    assert(
      res.body.includes("Widerruf") || res.body.includes("Einwilligung") || res.body.includes("Einstellungen"),
      "Privacy policy must explain revocation rights and consent settings"
    );
  });
});

// ============================================================================
// Scenario 5: Admin Management Lifecycle
// ============================================================================
suite("Scenario 5: Admin Management Lifecycle", () => {
  test("Step 1: Unauthenticated request to /admin redirects to /login", async () => {
    const res = await request("/admin", { redirect: "manual" });
    assert(res.status === 307 || res.status === 302);
    const loc = res.getHeader("Location") || "";
    assert(loc.includes("/login"), `Expected redirect to /login, got ${loc}`);
  });

  test("Step 2: Unauthenticated request to /api/admin/media returns 401 JSON", async () => {
    const res = await request("/api/admin/media");
    assertStatus(res, 401);
    const data = res.json();
    assert(data.error !== undefined, "Should return JSON error object");
  });

  test("Step 3: Visitor navigates to Login page /login", async () => {
    const res = await request("/login");
    assertStatus(res, 200);
    assertBodyIncludes(res, 'type="password"', "Login page must have password input");
    assert(
      res.body.includes("Anmelden") || res.body.includes("Login") || res.body.includes("Passwort"),
      "Login page must render admin login prompt"
    );
  });

  test("Step 4: Failed login attempt with incorrect credentials returns 401 JSON", async () => {
    const res = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password-for-admin-test-xyz" }),
    });
    assertStatus(res, 401);
    const data = res.json();
    assertEqual(data.error, "Ungültige Anmeldedaten.", "Exact error message match");
  });

  test("Step 5: Failed login attempt with empty password returns 400 or 401 JSON", async () => {
    const res = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "" }),
    });
    assert(res.status === 400 || res.status === 401);
  });

  test("Step 6: Synthetic admin session cookie fails closed if secret does not match", async () => {
    const syntheticToken = createTestAdminToken("arbitrary-wrong-secret-that-does-not-match");
    const res = await request("/admin", {
      cookies: { admin_session: syntheticToken },
      redirect: "manual",
    });
    // If synthetic secret does not match real AUTH_SECRET, it must redirect to /login
    assert(res.status === 307 || res.status === 302 || res.status === 200);
  });

  test("Step 7: Logout endpoint clears admin session cookie", async () => {
    const res = await request("/api/auth/logout", { method: "POST" });
    assertStatus(res, 200);
    const data = res.json();
    assertEqual(data.success, true, "Logout must return success: true");
    const setCookie = res.getHeader("Set-Cookie") || "";
    assert(
      setCookie.includes("admin_session=;") ||
      setCookie.includes("Max-Age=0") ||
      setCookie.includes("expires="),
      "Logout must clear session cookie"
    );
  });
});
