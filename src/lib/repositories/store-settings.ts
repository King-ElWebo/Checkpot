import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db";
import { systemSettings } from "@/db/schema";
import type { StoreDetails } from "@/lib/contracts/public";
import {
  type StoreSettingsRaw,
  DEFAULT_STORE_SETTINGS_RAW,
  DEFAULT_STORE_DETAILS,
  mapRawToStoreDetails,
} from "@/lib/contracts/store-defaults";

export {
  type StoreSettingsRaw,
  DEFAULT_STORE_SETTINGS_RAW,
  DEFAULT_STORE_DETAILS,
  derivePhoneHref,
  deriveWhatsappHref,
  deriveEmailHref,
  deriveRoutePlanningHref,
  deriveDisplayAddress,
  deriveHoursArray,
  mapRawToStoreDetails,
} from "@/lib/contracts/store-defaults";

/**
 * Reads the current store settings from Neon database.
 * Deduplicated per-request using React cache().
 * Falls back to verified default values if unconfigured or unpopulated.
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

    if (!row?.value) {
      return DEFAULT_STORE_DETAILS;
    }

    return mapRawToStoreDetails(row.value);
  } catch (error) {
    console.error("Failed to read store details from database, falling back to defaults:", error);
    return DEFAULT_STORE_DETAILS;
  }
});

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
      hours: {
        weekday: {
          opens: val.hours?.weekday?.opens || DEFAULT_STORE_SETTINGS_RAW.hours.weekday.opens,
          closes: val.hours?.weekday?.closes || DEFAULT_STORE_SETTINGS_RAW.hours.weekday.closes,
          closed: Boolean(val.hours?.weekday?.closed),
        },
        saturday: {
          opens: val.hours?.saturday?.opens || DEFAULT_STORE_SETTINGS_RAW.hours.saturday.opens,
          closes: val.hours?.saturday?.closes || DEFAULT_STORE_SETTINGS_RAW.hours.saturday.closes,
          closed: Boolean(val.hours?.saturday?.closed),
        },
      },
    };
  } catch (error) {
    console.error("Failed to read raw store settings, using defaults:", error);
    return DEFAULT_STORE_SETTINGS_RAW;
  }
}
