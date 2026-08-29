import type { StoreDetails, StoreHours } from "@/lib/contracts/public";

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
  hours: {
    weekday: {
      opens: string;
      closes: string;
      closed?: boolean;
    };
    saturday: {
      opens: string;
      closes: string;
      closed?: boolean;
    };
  };
}

export const DEFAULT_STORE_SETTINGS_RAW: StoreSettingsRaw = {
  name: "Checkpot Hietzing",
  owner: "Christa Hausmair",
  address: {
    street: "Hietzinger Hauptstraße 10-16",
    postalCode: "1130",
    city: "Wien",
    country: "AT",
  },
  phone: "(01) 877 58 87",
  whatsapp: "0676 3772514",
  email: "store@checkpot-hietzing.at",
  hours: {
    weekday: {
      opens: "10:00",
      closes: "18:00",
      closed: false,
    },
    saturday: {
      opens: "10:00",
      closes: "14:00",
      closed: false,
    },
  },
};

/**
 * Derives a clean international telephone href from phone string.
 * Example: "(01) 877 58 87" -> "tel:+4318775887"
 * Example: "+43 1 877 58 87" -> "tel:+4318775887"
 * Example: "0676 3772514" -> "tel:+436763772514"
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
 * Example: "0676 3772514" -> "https://wa.me/436763772514"
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

/**
 * Maps structured hours into presentation/Schema.org array.
 */
export function deriveHoursArray(hours: StoreSettingsRaw["hours"]): StoreHours[] {
  const result: StoreHours[] = [];

  // Weekday (Mo-Fr)
  if (hours.weekday.closed) {
    result.push({
      label: "Montag bis Freitag",
      value: "Geschlossen",
      schemaDays: [],
    });
  } else {
    result.push({
      label: "Montag bis Freitag",
      value: `${hours.weekday.opens}-${hours.weekday.closes}`,
      schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: hours.weekday.opens,
      closes: hours.weekday.closes,
    });
  }

  // Saturday
  if (hours.saturday.closed) {
    result.push({
      label: "Samstag",
      value: "Geschlossen",
      schemaDays: [],
    });
  } else {
    result.push({
      label: "Samstag",
      value: `${hours.saturday.opens}-${hours.saturday.closes}`,
      schemaDays: ["Saturday"],
      opens: hours.saturday.opens,
      closes: hours.saturday.closes,
    });
  }

  return result;
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

  const weekdayOpens = data.hours?.weekday?.opens || DEFAULT_STORE_SETTINGS_RAW.hours.weekday.opens;
  const weekdayCloses = data.hours?.weekday?.closes || DEFAULT_STORE_SETTINGS_RAW.hours.weekday.closes;
  const weekdayClosed = Boolean(data.hours?.weekday?.closed);

  const saturdayOpens = data.hours?.saturday?.opens || DEFAULT_STORE_SETTINGS_RAW.hours.saturday.opens;
  const saturdayCloses = data.hours?.saturday?.closes || DEFAULT_STORE_SETTINGS_RAW.hours.saturday.closes;
  const saturdayClosed = Boolean(data.hours?.saturday?.closed);

  const address = {
    street,
    postalCode,
    city,
    country,
    display: deriveDisplayAddress({ street, postalCode, city }),
  };

  const hoursArray = deriveHoursArray({
    weekday: { opens: weekdayOpens, closes: weekdayCloses, closed: weekdayClosed },
    saturday: { opens: saturdayOpens, closes: saturdayCloses, closed: saturdayClosed },
  });

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
  };
}

export const DEFAULT_STORE_DETAILS: StoreDetails = mapRawToStoreDetails(DEFAULT_STORE_SETTINGS_RAW);
