"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateSiteAccess } from "@/lib/repositories/site-access";
import {
  createSitePreviewToken,
  getPreviewCookieOptions,
  PREVIEW_COOKIE_NAME,
} from "@/lib/auth/preview";

export async function toggleSiteAccessAction(targetState: boolean) {
  await requireAdmin();

  const updated = await updateSiteAccess(targetState, "admin");

  // Revalidate admin dashboard and all public paths & metadata
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");

  return { success: true, maintenanceMode: updated.maintenanceMode };
}

export async function startSitePreviewAction() {
  await requireAdmin();

  const token = await createSitePreviewToken();
  const cookieStore = await cookies();
  cookieStore.set(PREVIEW_COOKIE_NAME, token, getPreviewCookieOptions());

  redirect("/");
}

export async function endSitePreviewAction() {
  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_COOKIE_NAME);

  revalidatePath("/", "layout");
  redirect("/");
}
