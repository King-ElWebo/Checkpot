import "server-only";

import crypto from "node:crypto";
import { sql, eq, lt } from "drizzle-orm";
import { getDatabase } from "@/db";
import { rateLimits } from "@/db/schema";

export interface RateLimitResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Computes a privacy-preserving pseudonymous hash from the subject identifier (e.g. IP)
 * using a server-side secret. Raw subject values are never persisted or logged.
 */
export function hashSubject(rawSubject: string): string {
  const secret = process.env.RATE_LIMIT_SECRET || process.env.AUTH_SECRET || "checkpot-fallback-rate-limit-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(rawSubject.trim().toLowerCase())
    .digest("hex");
}

/**
 * Concurrency-safe, atomic rate-limit checker and incrementer backed by Neon PostgreSQL.
 * Handles distributed serverless execution across Vercel function instances.
 */
export async function checkAndIncrementRateLimit(options: {
  scope: "login" | "contact";
  rawSubject: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { scope, rawSubject, limit, windowSeconds } = options;
  const db = getDatabase();
  const subjectHash = hashSubject(rawSubject);

  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const windowStartMs = Math.floor(now.getTime() / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs);
  const expiresAt = new Date(windowStartMs + windowMs * 2);
  const resetAt = new Date(windowStartMs + windowMs);
  const key = `${scope}:${subjectHash}:${windowStartMs}`;

  // Atomic UPSERT increment in Neon PostgreSQL
  const result = await db
    .insert(rateLimits)
    .values({
      key,
      scope,
      subjectHash,
      windowStart,
      requestCount: 1,
      expiresAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        requestCount: sql`${rateLimits.requestCount} + 1`,
        updatedAt: now,
      },
    })
    .returning({ count: rateLimits.requestCount });

  const currentCount = result[0]?.count ?? 1;

  // Opportunistic cleanup of expired keys (10% sampling on writes)
  if (Math.random() < 0.1) {
    db.delete(rateLimits)
      .where(lt(rateLimits.expiresAt, now))
      .catch(() => {
        // Safe background cleanup
      });
  }

  return {
    allowed: currentCount <= limit,
    currentCount,
    limit,
    remaining: Math.max(0, limit - currentCount),
    resetAt,
  };
}

/**
 * Checks if the subject is currently blocked due to excessive failed login attempts.
 */
export async function checkLoginRateLimit(
  rawSubject: string,
  limit = 5,
  windowSeconds = 900
): Promise<{ blocked: boolean; resetAt: Date }> {
  const db = getDatabase();
  const subjectHash = hashSubject(rawSubject);
  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const windowStartMs = Math.floor(now.getTime() / windowMs) * windowMs;
  const key = `login:${subjectHash}:${windowStartMs}`;
  const resetAt = new Date(windowStartMs + windowMs);

  const record = await db.query.rateLimits.findFirst({
    where: eq(rateLimits.key, key),
  });

  if (record && record.requestCount >= limit) {
    return { blocked: true, resetAt };
  }

  return { blocked: false, resetAt };
}

/**
 * Atomically records a failed login attempt for the subject.
 */
export async function recordFailedLoginAttempt(
  rawSubject: string,
  windowSeconds = 900
): Promise<number> {
  const db = getDatabase();
  const subjectHash = hashSubject(rawSubject);
  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const windowStartMs = Math.floor(now.getTime() / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs);
  const expiresAt = new Date(windowStartMs + windowMs * 2);
  const key = `login:${subjectHash}:${windowStartMs}`;

  const result = await db
    .insert(rateLimits)
    .values({
      key,
      scope: "login",
      subjectHash,
      windowStart,
      requestCount: 1,
      expiresAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        requestCount: sql`${rateLimits.requestCount} + 1`,
        updatedAt: now,
      },
    })
    .returning({ count: rateLimits.requestCount });

  return result[0]?.count ?? 1;
}

/**
 * Clears failed login attempts upon successful authentication.
 */
export async function resetLoginRateLimit(
  rawSubject: string,
  windowSeconds = 900
): Promise<void> {
  const db = getDatabase();
  const subjectHash = hashSubject(rawSubject);
  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const windowStartMs = Math.floor(now.getTime() / windowMs) * windowMs;
  const key = `login:${subjectHash}:${windowStartMs}`;

  await db.delete(rateLimits).where(eq(rateLimits.key, key)).catch(() => {});
}
