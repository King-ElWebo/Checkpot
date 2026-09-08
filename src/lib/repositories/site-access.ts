import "server-only";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db";
import { systemSettings, auditLogs } from "@/db/schema";

export interface SiteAccessSettings {
  maintenanceMode: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_SITE_ACCESS: SiteAccessSettings = {
  maintenanceMode: false,
};

async function readSiteAccessFromDatabase(): Promise<SiteAccessSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_SITE_ACCESS;
  }

  try {
    const database = getDatabase();
    const [row] = await database
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, "site_access"))
      .limit(1);

    if (!row?.value || typeof row.value !== "object") {
      return DEFAULT_SITE_ACCESS;
    }

    const val = row.value as Record<string, unknown>;
    return {
      maintenanceMode: Boolean(val.maintenanceMode),
      updatedAt: typeof val.updatedAt === "string" ? val.updatedAt : undefined,
      updatedBy: typeof val.updatedBy === "string" ? val.updatedBy : undefined,
    };
  } catch (error) {
    console.error("Failed to read site_access setting from database, falling back to public:", error);
    return DEFAULT_SITE_ACCESS;
  }
}

/**
 * Single source of truth for site access (maintenance mode) status.
 * Deduplicated per-request via React cache().
 * Fail-safe: returns maintenanceMode = false on any DB failure or missing setting.
 */
export const getSiteAccess = cache(async (): Promise<SiteAccessSettings> => {
  return await readSiteAccessFromDatabase();
});

/**
 * Updates site access setting and records an audit log entry.
 */
export async function updateSiteAccess(
  maintenanceMode: boolean,
  actor: string = "admin"
): Promise<SiteAccessSettings> {
  if (!isDatabaseConfigured()) {
    throw new Error("Datenbankverbindung ist nicht konfiguriert.");
  }

  const database = getDatabase();
  const current = await readSiteAccessFromDatabase();
  const previousState = current.maintenanceMode;

  const now = new Date();
  const payload: SiteAccessSettings = {
    maintenanceMode,
    updatedAt: now.toISOString(),
    updatedBy: actor,
  };

  const existing = await database.query.systemSettings.findFirst({
    where: eq(systemSettings.key, "site_access"),
  });

  if (existing) {
    await database
      .update(systemSettings)
      .set({
        value: payload,
        updatedAt: now,
      })
      .where(eq(systemSettings.key, "site_access"));
  } else {
    await database.insert(systemSettings).values({
      key: "site_access",
      value: payload,
    });
  }

  // Record audit log entry
  try {
    await database.insert(auditLogs).values({
      action: maintenanceMode ? "site_locked" : "site_published",
      resource: "site_access",
      actor,
      metadata: {
        previousState,
        newState: maintenanceMode,
        timestamp: now.toISOString(),
      },
    });
  } catch (auditError) {
    console.error("Failed to record site_access audit log entry:", auditError);
  }

  // Revalidate public layouts and metadata routes
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");

  return payload;
}
