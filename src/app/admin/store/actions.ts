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
    hoursMode: formData.get("hoursMode") || "compact",
    hoursNote: formData.get("hoursNote"),

    // Compact mode fields
    weekdayOpens: formData.get("weekdayOpens") || "09:30",
    weekdayCloses: formData.get("weekdayCloses") || "18:00",
    weekdayClosed: formData.get("weekdayClosed") === "true",

    saturdayOpens: formData.get("saturdayOpens") || "09:30",
    saturdayCloses: formData.get("saturdayCloses") || "13:00",
    saturdayClosed: formData.get("saturdayClosed") === "true",

    // Detailed individual day fields
    mondayOpens: formData.get("mondayOpens") || "09:30",
    mondayCloses: formData.get("mondayCloses") || "18:00",
    mondayClosed: formData.get("mondayClosed") === "true",

    tuesdayOpens: formData.get("tuesdayOpens") || "09:30",
    tuesdayCloses: formData.get("tuesdayCloses") || "18:00",
    tuesdayClosed: formData.get("tuesdayClosed") === "true",

    wednesdayOpens: formData.get("wednesdayOpens") || "09:30",
    wednesdayCloses: formData.get("wednesdayCloses") || "18:00",
    wednesdayClosed: formData.get("wednesdayClosed") === "true",

    thursdayOpens: formData.get("thursdayOpens") || "09:30",
    thursdayCloses: formData.get("thursdayCloses") || "18:00",
    thursdayClosed: formData.get("thursdayClosed") === "true",

    fridayOpens: formData.get("fridayOpens") || "09:30",
    fridayCloses: formData.get("fridayCloses") || "18:00",
    fridayClosed: formData.get("fridayClosed") === "true",

    sundayOpens: formData.get("sundayOpens") || "10:00",
    sundayCloses: formData.get("sundayCloses") || "18:00",
    sundayClosed: formData.get("sundayClosed") === "true",
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
    hoursMode: data.hoursMode,
    hoursNote: data.hoursNote || undefined,
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
      monday: {
        opens: data.mondayOpens,
        closes: data.mondayCloses,
        closed: data.mondayClosed,
      },
      tuesday: {
        opens: data.tuesdayOpens,
        closes: data.tuesdayCloses,
        closed: data.tuesdayClosed,
      },
      wednesday: {
        opens: data.wednesdayOpens,
        closes: data.wednesdayCloses,
        closed: data.wednesdayClosed,
      },
      thursday: {
        opens: data.thursdayOpens,
        closes: data.thursdayCloses,
        closed: data.thursdayClosed,
      },
      friday: {
        opens: data.fridayOpens,
        closes: data.fridayCloses,
        closed: data.fridayClosed,
      },
      sunday: {
        opens: data.sundayOpens,
        closes: data.sundayCloses,
        closed: data.sundayClosed,
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
