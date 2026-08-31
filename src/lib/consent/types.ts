export const CONSENT_COOKIE_NAME = "checkpot_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_MAX_AGE_SECONDS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  timestamp: string; // ISO 8601 date string
}

/**
 * Defensively parse and validate a raw consent cookie value.
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
      parsed.version === CONSENT_VERSION &&
      parsed.necessary === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.timestamp === "string"
    ) {
      return {
        version: CONSENT_VERSION,
        necessary: true,
        analytics: parsed.analytics,
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
export function createConsentState(analytics: boolean): ConsentState {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Serialize a consent choice into a cookie header string for client-side storage.
 */
export function serializeConsentCookie(analytics: boolean): string {
  const consent = createConsentState(analytics);
  const value = encodeURIComponent(JSON.stringify(consent));
  const isProd = process.env.NODE_ENV === "production";
  return `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; samesite=lax${
    isProd ? "; secure" : ""
  }`;
}
