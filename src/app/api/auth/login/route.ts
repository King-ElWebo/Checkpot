import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyAdminPassword } from "@/lib/auth/password";
import {
  createAdminSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
} from "@/lib/rate-limiter";

const loginSchema = z.object({
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "unknown-client";

  // 1. Check if the subject is currently blocked due to excessive failed attempts (5 failures in 15 mins)
  try {
    const { blocked } = await checkLoginRateLimit(clientIp, 5, 900);
    if (blocked) {
      return NextResponse.json(
        { error: "Zu viele fehlerhafte Anmeldeversuche. Bitte warten Sie 15 Minuten." },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error("[Login Rate Limit] Failed to check limit (continuing):", err);
  }

  // 2. Parse payload safely
  const result = loginSchema.safeParse(await request.json().catch(() => null));

  // 3. Verify password
  if (!result.success || !verifyAdminPassword(result.data.password)) {
    try {
      await recordFailedLoginAttempt(clientIp, 900);
    } catch (err) {
      console.error("[Login Rate Limit] Failed to record failure:", err);
    }

    return NextResponse.json(
      { error: "Ungültige Anmeldedaten." },
      { status: 401 }
    );
  }

  // 4. Reset failed attempts on success
  try {
    await resetLoginRateLimit(clientIp, 900);
  } catch (err) {
    console.error("[Login Rate Limit] Failed to reset limit on success:", err);
  }

  // 5. Issue JWT session token
  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return NextResponse.json({ success: true });
}
