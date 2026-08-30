import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db";
import { systemSettings } from "@/db/schema";
import type { StoreDetails } from "@/lib/contracts/public";
import {
  DEFAULT_STORE_DETAILS,
  DEFAULT_STORE_SETTINGS_RAW,
  mapRawToStoreDetails,
  deriveHoursArray,
  type DaySchedule,
  type StoreSettingsRaw,
} from "@/lib/contracts/store-defaults";

export {
  DEFAULT_STORE_DETAILS,
  DEFAULT_STORE_SETTINGS_RAW,
  mapRawToStoreDetails,
  deriveHoursArray,
  type DaySchedule,
  type StoreSettingsRaw,
};

/**
 * Single source of truth for public store facts cached across a single request lifecycle.
 */
export const getStoreDetails = cache(async (): Promise<StoreDetails> => {
  if (!isDatabaseConfigured()) {
    return DEFAULT_STORE_DETAILS;
  }

  try {
    const database = getDatabase();
    const [row] = await database
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, "store_details"))
      .limit(1);

    if (!row?.value || typeof row.value !== "object") {
      return DEFAULT_STORE_DETAILS;
    }

    return mapRawToStoreDetails(row.value);
  } catch (error) {
    console.error("Failed to read store details from database, falling back to defaults:", error);
    return DEFAULT_STORE_DETAILS;
  }
});

function extractHoursForForm(rawHours: unknown): StoreSettingsRaw["hours"] {
  const d = DEFAULT_STORE_SETTINGS_RAW.hours;

  if (Array.isArray(rawHours)) {
    const moFr = rawHours.find((h) => typeof h.label === "string" && h.label.includes("Montag"));
    const sa = rawHours.find((h) => typeof h.label === "string" && h.label.includes("Samstag"));
    const so = rawHours.find((h) => typeof h.label === "string" && h.label.includes("Sonntag"));

    const weekdayOpens = typeof moFr?.opens === "string" ? moFr.opens : d.weekday.opens;
    const weekdayCloses = typeof moFr?.closes === "string" ? moFr.closes : d.weekday.closes;
    const weekdayClosed = moFr?.value === "Geschlossen";

    const saturdayOpens = typeof sa?.opens === "string" ? sa.opens : d.saturday.opens;
    const saturdayCloses = typeof sa?.closes === "string" ? sa.closes : d.saturday.closes;
    const saturdayClosed = sa?.value === "Geschlossen";

    const sundayOpens = typeof so?.opens === "string" ? so.opens : d.sunday?.opens || "10:00";
    const sundayCloses = typeof so?.closes === "string" ? so.closes : d.sunday?.closes || "18:00";
    const sundayClosed = so ? so.value === "Geschlossen" : true;

    return {
      weekday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
      saturday: { opens: saturdayOpens, closes: saturdayCloses, closed: saturdayClosed },
      monday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
      tuesday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
      wednesday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
      thursday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
      friday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
      sunday: { opens: sundayOpens, closes: sundayCloses, closed: sundayClosed },
    };
  }

  const h = (rawHours && typeof rawHours === "object" ? rawHours : {}) as Record<string, Partial<DaySchedule>>;
  const weekday = h.weekday || d.weekday;
  const saturday = h.saturday || d.saturday;

  const wOpens = weekday.opens || d.weekday.opens;
  const wCloses = weekday.closes || d.weekday.closes;
  const wClosed = Boolean(weekday.closed);

  const saOpens = saturday.opens || d.saturday.opens;
  const saCloses = saturday.closes || d.saturday.closes;
  const saClosed = Boolean(saturday.closed);

  return {
    weekday: { opens: wOpens, closes: wCloses, closed: wClosed },
    saturday: { opens: saOpens, closes: saCloses, closed: saClosed },
    monday: {
      opens: h.monday?.opens || wOpens,
      closes: h.monday?.closes || wCloses,
      closed: h.monday?.closed !== undefined ? Boolean(h.monday.closed) : wClosed,
    },
    tuesday: {
      opens: h.tuesday?.opens || wOpens,
      closes: h.tuesday?.closes || wCloses,
      closed: h.tuesday?.closed !== undefined ? Boolean(h.tuesday.closed) : wClosed,
    },
    wednesday: {
      opens: h.wednesday?.opens || wOpens,
      closes: h.wednesday?.closes || wCloses,
      closed: h.wednesday?.closed !== undefined ? Boolean(h.wednesday.closed) : wClosed,
    },
    thursday: {
      opens: h.thursday?.opens || wOpens,
      closes: h.thursday?.closes || wCloses,
      closed: h.thursday?.closed !== undefined ? Boolean(h.thursday.closed) : wClosed,
    },
    friday: {
      opens: h.friday?.opens || wOpens,
      closes: h.friday?.closes || wCloses,
      closed: h.friday?.closed !== undefined ? Boolean(h.friday.closed) : wClosed,
    },
    sunday: {
      opens: h.sunday?.opens || "10:00",
      closes: h.sunday?.closes || "18:00",
      closed: h.sunday?.closed !== undefined ? Boolean(h.sunday.closed) : true,
    },
  };
}

/**
 * Reads raw settings for prefilling the Admin form.
 */
export async function getRawStoreSettings(): Promise<StoreSettingsRaw> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_STORE_SETTINGS_RAW;
  }

  try {
    const database = getDatabase();
    const [row] = await database
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, "store_details"))
      .limit(1);

    if (!row?.value || typeof row.value !== "object") {
      return DEFAULT_STORE_SETTINGS_RAW;
    }

    const val = row.value as Partial<StoreSettingsRaw>;

    return {
      name: val.name || DEFAULT_STORE_SETTINGS_RAW.name,
      owner: val.owner || DEFAULT_STORE_SETTINGS_RAW.owner,
      address: {
        street: val.address?.street || DEFAULT_STORE_SETTINGS_RAW.address.street,
        postalCode: val.address?.postalCode || DEFAULT_STORE_SETTINGS_RAW.address.postalCode,
        city: val.address?.city || DEFAULT_STORE_SETTINGS_RAW.address.city,
        country: val.address?.country || DEFAULT_STORE_SETTINGS_RAW.address.country,
      },
      phone: val.phone || DEFAULT_STORE_SETTINGS_RAW.phone,
      whatsapp: val.whatsapp || DEFAULT_STORE_SETTINGS_RAW.whatsapp,
      email: val.email || DEFAULT_STORE_SETTINGS_RAW.email,
      hoursMode: val.hoursMode === "detailed" ? "detailed" : "compact",
      hoursNote: typeof val.hoursNote === "string" ? val.hoursNote : "",
      hours: extractHoursForForm(val.hours),
    };
  } catch (error) {
    console.error("Failed to read raw store settings, using defaults:", error);
    return DEFAULT_STORE_SETTINGS_RAW;
  }
}
