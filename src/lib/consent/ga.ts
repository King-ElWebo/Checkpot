/**
 * Google Analytics 4 & Google Consent Mode v2 Basic Helper
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined;
}

/**
 * Initialize Google Consent Mode v2 default and update calls.
 * Follows official Google Consent Mode v2 specification:
 * Advertising categories (ad_storage, ad_user_data, ad_personalization) are ALWAYS denied for Checkpot.
 * analytics_storage is granted ONLY when analyticsGranted is true.
 */
export function updateGoogleConsent(analyticsGranted: boolean) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  // Google Consent Mode v2 update
  window.gtag("consent", "update", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/**
 * Best-effort client-side cleanup of known first-party Google Analytics cookies (_ga, _ga_*, _gid, _gat)
 * accessible via document.cookie across current hostname and parent domain scopes when consent is withdrawn.
 * Note: This cleans up accessible first-party browser cookies; it does not retroactively delete data already transmitted to Google.
 */
export function cleanupGoogleAnalyticsCookies() {
  if (typeof document === "undefined") return;

  const cookies = document.cookie.split(";");
  const hostname = window.location.hostname;
  const path = "/";

  // Identify apex domain if hostname is a subdomain (e.g. www.checkpot-hietzing.at -> checkpot-hietzing.at)
  const domainParts = hostname.split(".");
  const apexDomain = domainParts.length > 2 ? domainParts.slice(-2).join(".") : null;

  for (const cookie of cookies) {
    const name = cookie.split("=")[0].trim();
    if (
      name === "_ga" ||
      name.startsWith("_ga_") ||
      name === "_gid" ||
      name === "_gat" ||
      name.startsWith("_gat_")
    ) {
      // Clear cookie for current domain and root path
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=.${hostname}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${hostname}`;

      if (apexDomain) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=.${apexDomain}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${apexDomain}`;
      }
    }
  }
}
