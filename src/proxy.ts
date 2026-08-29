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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  // 1. Handle permanent 410 Gone responses for obsolete legacy paths
  if (GONE_PATHS.has(normalizedPath)) {
    return new NextResponse(
      "410 Gone - Dieser Inhalt wurde dauerhaft entfernt und ist nicht mehr verfügbar.",
      {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      }
    );
  }

  // 2. Admin area authentication & protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isAuthenticated = token ? await verifyAdminSessionToken(token) : false;

    if (isAuthenticated) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/marken/:path*",
    "/mode/:path*",
    "/schrankcheck-alt/:path*",
  ],
};
