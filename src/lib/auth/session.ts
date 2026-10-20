import "server-only";

import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const issuer = "customer-site-platform";
const audience = "customer-site-admin";

function getAuthSecret() {
  const value = process.env.AUTH_SECRET?.trim();

  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }

  return new TextEncoder().encode(value);
}

export async function createAdminSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());
}

// In-memory verification cache to eliminate redundant HMAC-SHA256 crypto overhead
const sessionVerificationCache = new Map<string, number>();

function pruneExpiredSessionCache(now: number) {
  if (sessionVerificationCache.size > 50) {
    for (const [key, exp] of sessionVerificationCache.entries()) {
      if (exp <= now) {
        sessionVerificationCache.delete(key);
      }
    }
    if (sessionVerificationCache.size > 100) {
      sessionVerificationCache.clear();
    }
  }
}

/**
 * Revokes an admin session token from the verification cache immediately.
 * If no token is provided, clears the entire verification cache.
 */
export function revokeAdminSessionToken(token?: string) {
  if (token) {
    sessionVerificationCache.delete(token);
  } else {
    sessionVerificationCache.clear();
  }
}

export async function verifyAdminSessionToken(token: string) {
  if (!token || typeof token !== "string") {
    return false;
  }

  const now = Date.now();
  const cachedExpiry = sessionVerificationCache.get(token);
  if (cachedExpiry && cachedExpiry > now) {
    return true;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
      issuer,
      audience,
    });

    const isValid = payload.sub === "admin" && payload.role === "admin";
    if (isValid) {
      pruneExpiredSessionCache(now);
      // Cache valid result for 60 seconds (or token exp if sooner)
      const expMs = typeof payload.exp === "number" ? payload.exp * 1000 : now + 60_000;
      sessionVerificationCache.set(token, Math.min(now + 60_000, expMs));
    }
    return isValid;
  } catch {
    sessionVerificationCache.delete(token);
    return false;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
