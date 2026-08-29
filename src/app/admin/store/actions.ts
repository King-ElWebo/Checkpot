"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { systemSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { storeSettingsSchema } from "@/lib/validations/admin";
import type { StoreSettingsRaw } from "@/lib/repositories/store-settings";

export async function saveStoreSettingsAction(formData: FormData) {
  await requireAdmin();

  const parsed = storeSettingsSchema.safeParse({
    name: formData.get("name"),
    owner: formData.get("owner"),
    street: formData.get("street"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    weekdayOpens: formData.get("weekdayOpens"),
    weekdayCloses: formData.get("weekdayCloses"),
    weekdayClosed: formData.get("weekdayClosed") === "true",
    saturdayOpens: formData.get("saturdayOpens"),
    saturdayCloses: formData.get("saturdayCloses"),
    saturdayClosed: formData.get("saturdayClosed") === "true",
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map((e) => e.message).join(", ");
    throw new Error(`Validierungsfehler: ${errorMessages}`);
  }

  const data = parsed.data;

  const rawData: StoreSettingsRaw = {
    name: data.name,
    owner: data.owner,
    address: {
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
    },
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    hours: {
      weekday: {
        opens: data.weekdayOpens,
        closes: data.weekdayCloses,
        closed: data.weekdayClosed,
      },
      saturday: {
        opens: data.saturdayOpens,
        closes: data.saturdayCloses,
        closed: data.saturdayClosed,
      },
    },
  };

  const database = getDatabase();

  const existing = await database.query.systemSettings.findFirst({
    where: eq(systemSettings.key, "store_details"),
  });

  if (existing) {
    await database
      .update(systemSettings)
      .set({
        value: rawData,
        updatedAt: new Date(),
      })
      .where(eq(systemSettings.key, "store_details"));
  } else {
    await database.insert(systemSettings).values({
      key: "store_details",
      value: rawData,
    });
  }

  // Targeted revalidations
  revalidatePath("/admin/store");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/kontakt");
  revalidatePath("/ueber-uns");
  revalidatePath("/impressum");
  revalidatePath("/datenschutz");
  revalidatePath("/sitemap.xml");
}
