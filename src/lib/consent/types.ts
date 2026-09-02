export const CONSENT_COOKIE_NAME = "checkpot_consent";
export const CONSENT_VERSION = 2;
export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_MAX_AGE_SECONDS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  externalMedia: boolean;
  timestamp: string; // ISO 8601 date string
}

/**
 * Defensively parse and validate a raw consent cookie value.
 * Supports migrating version 1 cookies safely without implicitly granting externalMedia.
 * Returns null if the cookie is missing, corrupt, or has an outdated version.
 */
export function parseConsentCookie(rawCookie?: string | null): ConsentState | null {
  if (!rawCookie || typeof rawCookie !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawCookie));
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed.version === 1 || parsed.version === 2) &&
      parsed.necessary === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.timestamp === "string"
    ) {
      return {
        version: CONSENT_VERSION,
        necessary: true,
        analytics: parsed.analytics,
        externalMedia: parsed.version === 2 && typeof parsed.externalMedia === "boolean" ? parsed.externalMedia : false,
        timestamp: parsed.timestamp,
      };
    }
  } catch {
    // Malformed JSON - treat as unconsented
  }

  return null;
}

/**
 * Create a valid ConsentState object.
 */
export function createConsentState(analytics: boolean, externalMedia: boolean = false): ConsentState {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    externalMedia,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Serialize a consent choice into a cookie header string for client-side storage.
 */
export function serializeConsentCookie(analytics: boolean, externalMedia: boolean = false): string {
  const consent = createConsentState(analytics, externalMedia);
  const value = encodeURIComponent(JSON.stringify(consent));
  const isProd = process.env.NODE_ENV === "production";
  return `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; samesite=lax${
    isProd ? "; secure" : ""
  }`;
}
