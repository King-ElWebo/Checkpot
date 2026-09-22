import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth/session";

/**
 * Historical URLs verified from GSC / GA4 exports where content was permanently
 * removed without an equivalent successor. These return an explicit HTTP 410 Gone.
 */
const GONE_PATHS = new Set([
  "/marken/zilch-wien",
  "/marken/adini-wien",
  "/marken/happy-rainy-days-wien",
  "/marken/hatley",
  "/marken/thought-braintree-wien",
  "/mode/herbstwinter-kollektion-2023-",
  "/mode/herbst-winter-2018",
  "/schrankcheck-alt/schrankcheck",
]);

const PERMANENT_REDIRECTS: Record<string, string> = {
  // Core alias redirects
  "/team": "/ueber-uns",
  "/brands": "/marken",
  "/home": "/",
  "/home/checkpot_damenmoden_1130_wien_": "/",

  // About / Team / Store photos
  "/ueber_uns": "/ueber-uns",
  "/ueber_uns/unser_team": "/ueber-uns",
  "/ueber_uns/fotos-vom-geschaeft": "/ueber-uns",

  // Contact / Legal
  "/kontakt/kontakt": "/kontakt",
  "/kontakt/impressum": "/impressum",
  "/kontakt/datenschutz": "/datenschutz",

  // Mode & Collections
  "/mode/unsere-marken": "/marken",
  "/mode/fair_trade": "/fair-trade",
  "/mode/vorschau-auf-herbst-winter-2025": "/mode",
  "/mode/vorschau-auf-fruehjahr-sommer-2026": "/mode",
  "/mode/vorschau-auf-fruehling-sommer-2025": "/mode",

  // Active Brand normalization
  "/marken/king-louie-wien": "/marken/king-louie",
  "/marken/madness-wien": "/marken/madness",
  "/marken/angels-wien": "/marken/angels",
  "/marken/sorgenfri-wien": "/marken/sorgenfri",
  "/marken/emily-van-den-berg": "/marken/emily-van-den-bergh",
  "/marken/emily-van-den-bergh-wien": "/marken/emily-van-den-bergh",
  "/marken/nomads-clothing-": "/marken/nomads",
};

const SECURITY_HEADERS = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function applySecurityHeaders(headers: Headers) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;

  // 1. Handle permanent 410 Gone responses for obsolete legacy paths
  if (GONE_PATHS.has(normalizedPath)) {
    return new NextResponse(
      "410 Gone - Dieser Inhalt wurde dauerhaft entfernt und ist nicht mehr verfügbar.",
      {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          ...SECURITY_HEADERS,
        },
      }
    );
  }

  // 2. Handle 301 Permanent Redirects
  if (PERMANENT_REDIRECTS[normalizedPath]) {
    const destination = PERMANENT_REDIRECTS[normalizedPath];
    const redirectUrl = new URL(destination, request.url);
    const response = NextResponse.redirect(redirectUrl, 301);
    applySecurityHeaders(response.headers);
    return response;
  }

  // Handle trailing slash redirect for non-root paths
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const cleanUrl = new URL(normalizedPath, request.url);
    cleanUrl.search = request.nextUrl.search;
    const response = NextResponse.redirect(cleanUrl, 301);
    applySecurityHeaders(response.headers);
    return response;
  }

  // 3. Admin area authentication & protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isAuthenticated = token ? await verifyAdminSessionToken(token) : false;

    if (isAuthenticated) {
      const response = NextResponse.next();
      applySecurityHeaders(response.headers);
      return response;
    }

    if (pathname.startsWith("/api/admin")) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      applySecurityHeaders(response.headers);
      return response;
    }

    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response.headers);
    return response;
  }

  // 4. Forward pathname in header for server-side layout detection and attach security headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  applySecurityHeaders(response.headers);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, apple-icon.png (metadata icons)
     * - customer (static public customer images)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|customer/).*)",
  ],
};
