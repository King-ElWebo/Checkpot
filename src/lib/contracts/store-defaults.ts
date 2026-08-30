import type { StoreDetails, StoreHours } from "@/lib/contracts/public";

export interface DaySchedule {
  opens: string;
  closes: string;
  closed?: boolean;
}

export interface StoreSettingsRaw {
  name: string;
  owner: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  hoursMode?: "compact" | "detailed";
  hoursNote?: string;
  hours: {
    weekday: DaySchedule;
    saturday: DaySchedule;
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    sunday?: DaySchedule;
  };
}

export const DEFAULT_STORE_SETTINGS_RAW: StoreSettingsRaw = {
  name: "Checkpot Damenmoden",
  owner: "Christa Hausmair",
  address: {
    street: "Hietzinger Hauptstraße 10-16",
    postalCode: "1130",
    city: "Wien",
    country: "AT",
  },
  phone: "+43 1 876 54 32",
  whatsapp: "+43 676 123 45 67",
  email: "christa.hausmair@outlook.at",
  hoursMode: "compact",
  hoursNote: "",
  hours: {
    weekday: {
      opens: "09:30",
      closes: "18:00",
      closed: false,
    },
    saturday: {
      opens: "09:30",
      closes: "13:00",
      closed: false,
    },
    monday: { opens: "09:30", closes: "18:00", closed: false },
    tuesday: { opens: "09:30", closes: "18:00", closed: false },
    wednesday: { opens: "09:30", closes: "18:00", closed: false },
    thursday: { opens: "09:30", closes: "18:00", closed: false },
    friday: { opens: "09:30", closes: "18:00", closed: false },
    sunday: { opens: "10:00", closes: "18:00", closed: true },
  },
};

/**
 * Derives a clean international telephone href from phone string.
 */
export function derivePhoneHref(phone: string): string {
  const digitsOnly = phone.replace(/[^\d+]/g, "");
  if (digitsOnly.startsWith("+")) {
    return `tel:${digitsOnly}`;
  }
  if (digitsOnly.startsWith("0")) {
    return `tel:+43${digitsOnly.slice(1)}`;
  }
  return `tel:+43${digitsOnly}`;
}

/**
 * Derives a WhatsApp direct conversation link.
 */
export function deriveWhatsappHref(whatsapp: string): string {
  const digitsOnly = whatsapp.replace(/\D/g, "");
  if (digitsOnly.startsWith("43")) {
    return `https://wa.me/${digitsOnly}`;
  }
  if (digitsOnly.startsWith("0")) {
    return `https://wa.me/43${digitsOnly.slice(1)}`;
  }
  return `https://wa.me/43${digitsOnly}`;
}

/**
 * Derives an email mailto href.
 */
export function deriveEmailHref(email: string): string {
  return `mailto:${email.trim()}`;
}

/**
 * Derives an external Google Maps route planning link.
 */
export function deriveRoutePlanningHref(address: { street: string; postalCode: string; city: string }): string {
  const query = `${address.street}, ${address.postalCode} ${address.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Derives single display address line.
 */
export function deriveDisplayAddress(address: { street: string; postalCode: string; city: string }): string {
  return `${address.street}, ${address.postalCode} ${address.city}`;
}

const DAY_DEFINITIONS = [
  { key: "monday", label: "Montag", short: "Mo", schema: "Monday" },
  { key: "tuesday", label: "Dienstag", short: "Di", schema: "Tuesday" },
  { key: "wednesday", label: "Mittwoch", short: "Mi", schema: "Wednesday" },
  { key: "thursday", label: "Donnerstag", short: "Do", schema: "Thursday" },
  { key: "friday", label: "Freitag", short: "Fr", schema: "Friday" },
  { key: "saturday", label: "Samstag", short: "Sa", schema: "Saturday" },
  { key: "sunday", label: "Sonntag", short: "So", schema: "Sunday" },
] as const;

/**
 * Maps structured hours into presentation/Schema.org array.
 * Supports compact (Mo-Fr + Sa + So) and detailed day-by-day with smart grouping.
 */
export function deriveHoursArray(
  hours: unknown,
  mode: "compact" | "detailed" = "compact"
): StoreHours[] {
  // 1. If hours is already a legacy StoreHours[] array from seed
  if (Array.isArray(hours) && hours.length > 0) {
    return hours.map((h: Record<string, unknown>) => ({
      label: String(h.label || "Öffnungszeiten"),
      value: String(h.value || ""),
      schemaDays: Array.isArray(h.schemaDays) ? (h.schemaDays as string[]) : undefined,
      opens: typeof h.opens === "string" ? h.opens : undefined,
      closes: typeof h.closes === "string" ? h.closes : undefined,
    }));
  }

  const hoursObj = (hours && typeof hours === "object" ? hours : {}) as Record<string, Partial<DaySchedule>>;
  const weekday = hoursObj.weekday || DEFAULT_STORE_SETTINGS_RAW.hours.weekday;
  const saturday = hoursObj.saturday || DEFAULT_STORE_SETTINGS_RAW.hours.saturday;

  // 2. Compact Mode: "Montag bis Freitag" & "Samstag"
  if (mode === "compact") {
    const result: StoreHours[] = [];

    if (weekday.closed) {
      result.push({
        label: "Montag – Freitag",
        value: "Geschlossen",
        schemaDays: [],
      });
    } else {
      const opens = weekday.opens || "09:30";
      const closes = weekday.closes || "18:00";
      result.push({
        label: "Montag – Freitag",
        value: `${opens} – ${closes} Uhr`,
        schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens,
        closes,
      });
    }

    if (saturday.closed) {
      result.push({
        label: "Samstag",
        value: "Geschlossen",
        schemaDays: [],
      });
    } else {
      const opens = saturday.opens || "09:30";
      const closes = saturday.closes || "13:00";
      result.push({
        label: "Samstag",
        value: `${opens} – ${closes} Uhr`,
        schemaDays: ["Saturday"],
        opens,
        closes,
      });
    }

    // Optional Sunday entry if explicitly configured
    if (hoursObj.sunday && !hoursObj.sunday.closed && hoursObj.sunday.opens && hoursObj.sunday.closes) {
      result.push({
        label: "Sonntag",
        value: `${hoursObj.sunday.opens} – ${hoursObj.sunday.closes} Uhr`,
        schemaDays: ["Sunday"],
        opens: hoursObj.sunday.opens,
        closes: hoursObj.sunday.closes,
      });
    }

    return result;
  }

  // 3. Detailed Mode: 7 Individual Days with smart contiguous grouping
  const daySchedules = DAY_DEFINITIONS.map((def) => {
    let dayData: Partial<DaySchedule> | undefined;

    if (def.key === "monday") dayData = hoursObj.monday || weekday;
    else if (def.key === "tuesday") dayData = hoursObj.tuesday || weekday;
    else if (def.key === "wednesday") dayData = hoursObj.wednesday || weekday;
    else if (def.key === "thursday") dayData = hoursObj.thursday || weekday;
    else if (def.key === "friday") dayData = hoursObj.friday || weekday;
    else if (def.key === "saturday") dayData = hoursObj.saturday || saturday;
    else if (def.key === "sunday") dayData = hoursObj.sunday || { closed: true, opens: "10:00", closes: "18:00" };

    const closed = Boolean(dayData?.closed);
    const opens = dayData?.opens || (def.key === "saturday" ? "09:30" : "09:30");
    const closes = dayData?.closes || (def.key === "saturday" ? "13:00" : "18:00");

    return {
      def,
      closed,
      opens,
      closes,
      timeKey: closed ? "closed" : `${opens}-${closes}`,
    };
  });

  // Group contiguous days with identical times
  const grouped: StoreHours[] = [];
  let currentGroup: typeof daySchedules = [];

  for (let i = 0; i < daySchedules.length; i++) {
    const current = daySchedules[i];
    if (currentGroup.length === 0) {
      currentGroup.push(current);
    } else if (currentGroup[0].timeKey === current.timeKey) {
      currentGroup.push(current);
    } else {
      // Flush current group
      grouped.push(formatDayGroup(currentGroup));
      currentGroup = [current];
    }
  }

  if (currentGroup.length > 0) {
    grouped.push(formatDayGroup(currentGroup));
  }

  return grouped;
}

function formatDayGroup(group: Array<{
  def: (typeof DAY_DEFINITIONS)[number];
  closed: boolean;
  opens: string;
  closes: string;
  timeKey: string;
}>): StoreHours {
  const isSingle = group.length === 1;
  const label = isSingle
    ? group[0].def.label
    : `${group[0].def.label} – ${group[group.length - 1].def.label}`;

  if (group[0].closed) {
    return {
      label,
      value: "Geschlossen",
      schemaDays: [],
    };
  }

  return {
    label,
    value: `${group[0].opens} – ${group[0].closes} Uhr`,
    schemaDays: group.map((g) => g.def.schema),
    opens: group[0].opens,
    closes: group[0].closes,
  };
}

/**
 * Maps raw JSON from DB (or fallback) into the typed StoreDetails public DTO.
 */
export function mapRawToStoreDetails(raw: unknown): StoreDetails {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<StoreSettingsRaw>;

  const name = typeof data.name === "string" && data.name.trim() ? data.name.trim() : DEFAULT_STORE_SETTINGS_RAW.name;
  const owner = typeof data.owner === "string" && data.owner.trim() ? data.owner.trim() : DEFAULT_STORE_SETTINGS_RAW.owner;
  const street = typeof data.address?.street === "string" && data.address.street.trim() ? data.address.street.trim() : DEFAULT_STORE_SETTINGS_RAW.address.street;
  const postalCode = typeof data.address?.postalCode === "string" && data.address.postalCode.trim() ? data.address.postalCode.trim() : DEFAULT_STORE_SETTINGS_RAW.address.postalCode;
  const city = typeof data.address?.city === "string" && data.address.city.trim() ? data.address.city.trim() : DEFAULT_STORE_SETTINGS_RAW.address.city;
  const country = typeof data.address?.country === "string" && data.address.country.trim() ? data.address.country.trim() : DEFAULT_STORE_SETTINGS_RAW.address.country;

  const phone = typeof data.phone === "string" && data.phone.trim() ? data.phone.trim() : DEFAULT_STORE_SETTINGS_RAW.phone;
  const whatsapp = typeof data.whatsapp === "string" && data.whatsapp.trim() ? data.whatsapp.trim() : DEFAULT_STORE_SETTINGS_RAW.whatsapp;
  const email = typeof data.email === "string" && data.email.trim() ? data.email.trim() : DEFAULT_STORE_SETTINGS_RAW.email;

  const hoursMode = data.hoursMode === "detailed" ? "detailed" : "compact";
  const hoursNote = typeof data.hoursNote === "string" ? data.hoursNote.trim() : undefined;

  const address = {
    street,
    postalCode,
    city,
    country,
    display: deriveDisplayAddress({ street, postalCode, city }),
  };

  const hoursArray = deriveHoursArray(data.hours, hoursMode);

  return {
    name,
    owner,
    address,
    phone,
    phoneHref: derivePhoneHref(phone),
    whatsapp,
    whatsappHref: deriveWhatsappHref(whatsapp),
    email,
    emailHref: deriveEmailHref(email),
    routePlanningHref: deriveRoutePlanningHref({ street, postalCode, city }),
    hours: hoursArray,
    hoursNote: hoursNote || undefined,
  };
}

export const DEFAULT_STORE_DETAILS: StoreDetails = mapRawToStoreDetails(DEFAULT_STORE_SETTINGS_RAW);
