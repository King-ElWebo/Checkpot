/**
 * Central site URL and configuration helper.
 * Normalizes environment-backed SITE_URL with safe production fallback.
 */

const DEFAULT_SITE_URL = "https://checkpot-hietzing.at";

export function getSiteUrl(): string {
  const envUrl = process.env.SITE_URL?.trim();

  if (!envUrl) {
    return DEFAULT_SITE_URL;
  }

  let normalized = envUrl;

  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, "");

  return normalized;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
