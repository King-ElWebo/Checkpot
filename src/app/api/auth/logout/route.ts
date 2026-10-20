import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, revokeAdminSessionToken } from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    revokeAdminSessionToken(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ success: true });
}
