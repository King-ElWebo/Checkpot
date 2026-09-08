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

export async function verifySitePreviewToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
      issuer,
      audience,
    });

    return payload.sub === "admin-preview" && payload.role === "admin" && payload.scope === "site_preview";
  } catch {
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
