import type { R2Bucket } from "@cloudflare/workers-types";

export interface UploadOptions {
  contentType: string;
  cacheControl?: string;
}

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Extracts the storage key from a relative path or full URL.
 * e.g. "https://media.checkpot.at/media/abc.jpg" -> "media/abc.jpg"
 * e.g. "media/abc.jpg" -> "media/abc.jpg"
 */
export function extractStorageKey(keyOrUrl: string): string {
  if (!keyOrUrl) return "";
  const trimmed = keyOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      return url.pathname.replace(/^\/+/, "");
    } catch {
      return trimmed.replace(/^\/+/, "");
    }
  }
  return trimmed.replace(/^\/+/, "");
}

/**
 * Resolves the public URL prefix for R2 assets.
 * Defaults to "https://media.checkpot.at", or reads from environment variables
 * (R2_PUBLIC_URL_PREFIX, NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX, NEXT_PUBLIC_R2_PUBLIC_DOMAIN).
 */
export function getPublicUrlPrefix(): string {
  const envPrefix =
    process.env.R2_PUBLIC_URL_PREFIX ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX ||
    (process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN
      ? `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}`
      : "");

  if (envPrefix) {
    return envPrefix.replace(/\/+$/, "");
  }
  return "https://media.checkpot.at";
}

/**
 * Returns the public delivery URL for a given object key.
 */
export function getPublicUrl(key: string): string {
  const cleanKey = extractStorageKey(key);
  const prefix = getPublicUrlPrefix();
  return `${prefix}/${cleanKey}`;
}

export const LEGACY_BLOB_STOREFRONT_IMAGE_URL =
  "https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg";

export const LOCAL_STOREFRONT_IMAGE_FALLBACK = "/customer/christa-storefront.jpg";

/**
 * Normalizes storefront entrance image URL resolution:
 * Resolves to R2 public delivery URL (e.g. https://media.checkpot.at/store/checkpot-storefront-entrance.jpg),
 * with local fallback support, while retaining the legacy Blob fallback when requested.
 */
export function getStorefrontImageUrl(): string {
  if (process.env.NEXT_PUBLIC_STORE_IMAGE_URL) {
    return process.env.NEXT_PUBLIC_STORE_IMAGE_URL;
  }
  if (process.env.NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE === "true") {
    return LOCAL_STOREFRONT_IMAGE_FALLBACK;
  }
  if (process.env.NEXT_PUBLIC_USE_LEGACY_BLOB === "true") {
    return LEGACY_BLOB_STOREFRONT_IMAGE_URL;
  }
  return getPublicUrl("store/checkpot-storefront-entrance.jpg");
}

export const STOREFRONT_IMAGE_URL = getStorefrontImageUrl();

/**
 * Resolves the Cloudflare R2 bucket binding (MEDIA_BUCKET).
 * In Cloudflare Workers / vinext, loads from cloudflare:workers env or global bindings.
 * Returns null if not running in a Cloudflare Workers runtime.
 */
async function getMediaBucket(): Promise<R2Bucket | null> {
  // 1. Check global/runtime bindings (e.g. workerd globalThis, vinext runtime)
  if (typeof globalThis !== "undefined") {
    const g = globalThis as Record<string, unknown>;
    if (g.MEDIA_BUCKET && typeof (g.MEDIA_BUCKET as R2Bucket).put === "function") {
      return g.MEDIA_BUCKET as R2Bucket;
    }
    const envObj = (g.env || g.__env__) as Record<string, unknown> | undefined;
    if (envObj?.MEDIA_BUCKET && typeof (envObj.MEDIA_BUCKET as R2Bucket).put === "function") {
      return envObj.MEDIA_BUCKET as R2Bucket;
    }
  }

  // 2. Try importing cloudflare:workers in Cloudflare Workers / workerd environment
  try {
    const cf = await import("cloudflare:workers");
    if (cf?.env?.MEDIA_BUCKET) {
      return cf.env.MEDIA_BUCKET as unknown as R2Bucket;
    }
  } catch {
    // Expected when running in standard Node.js without workerd
  }

  return null;
}

/**
 * Uploads a file to Cloudflare R2 storage.
 *
 * @param key The destination path in the bucket (e.g., "media/uuid.jpg").
 * @param file The file data as File, Blob, or Uint8Array.
 * @param options Content-Type and optional Cache-Control headers.
 */
export async function uploadFile(
  key: string,
  file: File | Blob | Uint8Array,
  options: UploadOptions
): Promise<UploadResult> {
  const cleanKey = extractStorageKey(key);
  const cacheControl = options.cacheControl || "public, max-age=31536000, immutable";
  const contentType = options.contentType || "application/octet-stream";

  const bucket = await getMediaBucket();

  if (bucket) {
    let data: ArrayBuffer | Uint8Array;
    if (file instanceof Uint8Array) {
      data = file;
    } else {
      data = await file.arrayBuffer();
    }

    await bucket.put(cleanKey, data, {
      httpMetadata: {
        contentType,
        cacheControl,
      },
    });

    return {
      url: getPublicUrl(cleanKey),
      key: cleanKey,
    };
  }

  // Graceful development fallback for local Node development outside Workerd
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    console.warn(
      `[storage] Development fallback: MEDIA_BUCKET binding not found. Simulated upload for key "${cleanKey}".`
    );
    return {
      url: getPublicUrl(cleanKey),
      key: cleanKey,
    };
  }

  throw new Error(
    "Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment."
  );
}

/**
 * Deletes a file from Cloudflare R2 storage by key or public URL.
 *
 * @param keyOrUrl The key (e.g., "media/uuid.jpg") or full public URL of the object to delete.
 */
export async function deleteFile(keyOrUrl: string): Promise<void> {
  const cleanKey = extractStorageKey(keyOrUrl);
  if (!cleanKey) return;

  const bucket = await getMediaBucket();

  if (bucket) {
    await bucket.delete(cleanKey);
    return;
  }

  // Graceful development fallback
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    console.warn(
      `[storage] Development fallback: MEDIA_BUCKET binding not found. Simulated deletion for key "${cleanKey}".`
    );
    return;
  }

  throw new Error(
    "Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment."
  );
}
