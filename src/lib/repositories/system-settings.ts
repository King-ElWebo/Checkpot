import "server-only";

import { eq } from "drizzle-orm";

import { getDatabase } from "@/db";
import { systemSettings } from "@/db/schema";

export async function readSystemSetting(key: string): Promise<unknown | null> {
  const [setting] = await getDatabase()
    .select({ value: systemSettings.value })
    .from(systemSettings)
    .where(eq(systemSettings.key, key))
    .limit(1);

  return setting?.value ?? null;
}
