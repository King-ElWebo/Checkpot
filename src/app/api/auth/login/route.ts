import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyAdminPassword } from "@/lib/auth/password";
import {
  createAdminSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

const loginSchema = z.object({
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  const result = loginSchema.safeParse(await request.json().catch(() => null));

  if (!result.success || !verifyAdminPassword(result.data.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return NextResponse.json({ success: true });
}
