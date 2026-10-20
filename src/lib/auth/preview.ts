import "server-only";

import { jwtVerify, SignJWT } from "jose";

export const PREVIEW_COOKIE_NAME = "checkpot_site_preview";
export const PREVIEW_MAX_AGE_SECONDS = 60 * 60 * 2; // 2 hours

const issuer = "customer-site-platform";
const audience = "customer-site-preview";

function getAuthSecret() {
  const value = process.env.AUTH_SECRET?.trim();

  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }

  return new TextEncoder().encode(value);
}

export async function createSitePreviewToken() {
  return new SignJWT({ role: "admin", scope: "site_preview" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin-preview")
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${PREVIEW_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());
}

// In-memory verification cache for preview tokens
const previewVerificationCache = new Map<string, number>();

function pruneExpiredPreviewCache(now: number) {
  if (previewVerificationCache.size > 50) {
    for (const [key, exp] of previewVerificationCache.entries()) {
      if (exp <= now) {
        previewVerificationCache.delete(key);
      }
    }
    if (previewVerificationCache.size > 100) {
      previewVerificationCache.clear();
    }
  }
}

/**
 * Revokes a preview token from the verification cache immediately.
 * If no token is provided, clears the entire preview verification cache.
 */
export function revokeSitePreviewToken(token?: string) {
  if (token) {
    previewVerificationCache.delete(token);
  } else {
    previewVerificationCache.clear();
  }
}

export async function verifySitePreviewToken(token: string): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }

  const now = Date.now();
  const cachedExpiry = previewVerificationCache.get(token);
  if (cachedExpiry && cachedExpiry > now) {
    return true;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
      issuer,
      audience,
    });

    const isValid = payload.sub === "admin-preview" && payload.role === "admin" && payload.scope === "site_preview";
    if (isValid) {
      pruneExpiredPreviewCache(now);
      const expMs = typeof payload.exp === "number" ? payload.exp * 1000 : now + 60_000;
      previewVerificationCache.set(token, Math.min(now + 60_000, expMs));
    }
    return isValid;
  } catch {
    previewVerificationCache.delete(token);
    return false;
  }
}

export function getPreviewCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: PREVIEW_MAX_AGE_SECONDS,
  };
}
