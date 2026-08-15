"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { pageContent } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

import { pageContentSchema } from "@/lib/validations/admin";

export async function savePageAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const parsed = pageContentSchema.safeParse({
    routeKey: formData.get("routeKey"),
    content: formData.get("content"),
    visibility: formData.get("visibility") === "true",
  });

  if (!parsed.success) {
    throw new Error(`Validierungsfehler: ${parsed.error.issues.map((e: { message: string }) => e.message).join(", ")}`);
  }

  const data = parsed.data;
  const database = getDatabase();

  let oldRouteKey: string | undefined;

  if (id && id !== "new") {
    const oldPage = await database.query.pageContent.findFirst({
      where: eq(pageContent.id, id),
      columns: { routeKey: true }
    });
    if (oldPage && oldPage.routeKey !== data.routeKey) {
      oldRouteKey = oldPage.routeKey;
    }
    await database.update(pageContent).set(data).where(eq(pageContent.id, id));
  } else {
    await database.insert(pageContent).values(data);
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/${data.routeKey === "home" ? "" : data.routeKey}`);
  if (oldRouteKey) {
    revalidatePath(`/${oldRouteKey === "home" ? "" : oldRouteKey}`);
  }
}

export async function deletePageAction(id: string) {
  await requireAdmin();
  const database = getDatabase();

  const page = await database.query.pageContent.findFirst({
    where: eq(pageContent.id, id),
    columns: { routeKey: true }
  });

  await database.delete(pageContent).where(eq(pageContent.id, id));
  
  revalidatePath("/admin/pages");
  if (page) {
    revalidatePath(`/${page.routeKey === "home" ? "" : page.routeKey}`);
  }
}
