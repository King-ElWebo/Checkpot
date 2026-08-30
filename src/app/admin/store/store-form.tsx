"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveStoreSettingsAction } from "./actions";
import type { StoreSettingsRaw } from "@/lib/contracts/store-defaults";

const DAYS = [
  { key: "monday", label: "Montag", short: "Mo" },
  { key: "tuesday", label: "Dienstag", short: "Di" },
  { key: "wednesday", label: "Mittwoch", short: "Mi" },
  { key: "thursday", label: "Donnerstag", short: "Do" },
  { key: "friday", label: "Freitag", short: "Fr" },
  { key: "saturday", label: "Samstag", short: "Sa" },
  { key: "sunday", label: "Sonntag", short: "So" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

interface StoreFormProps {
  initialData: StoreSettingsRaw;
}

export function StoreForm({ initialData }: StoreFormProps) {
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [hoursMode, setHoursMode] = useState<"compact" | "detailed">(
    initialData.hoursMode || "compact"
  );
  const [hoursNote, setHoursNote] = useState(initialData.hoursNote || "");

  // Compact schedule
  const [weekday, setWeekday] = useState({
    opens: initialData.hours.weekday?.opens || "09:30",
    closes: initialData.hours.weekday?.closes || "18:00",
    closed: Boolean(initialData.hours.weekday?.closed),
  });

  const [saturday, setSaturday] = useState({
    opens: initialData.hours.saturday?.opens || "09:30",
    closes: initialData.hours.saturday?.closes || "13:00",
    closed: Boolean(initialData.hours.saturday?.closed),
  });

  // Detailed schedule
  const [detailedDays, setDetailedDays] = useState<Record<DayKey, { opens: string; closes: string; closed: boolean }>>({
    monday: {
      opens: initialData.hours.monday?.opens || initialData.hours.weekday?.opens || "09:30",
      closes: initialData.hours.monday?.closes || initialData.hours.weekday?.closes || "18:00",
      closed: initialData.hours.monday?.closed ?? initialData.hours.weekday?.closed ?? false,
    },
    tuesday: {
      opens: initialData.hours.tuesday?.opens || initialData.hours.weekday?.opens || "09:30",
      closes: initialData.hours.tuesday?.closes || initialData.hours.weekday?.closes || "18:00",
      closed: initialData.hours.tuesday?.closed ?? initialData.hours.weekday?.closed ?? false,
    },
    wednesday: {
      opens: initialData.hours.wednesday?.opens || initialData.hours.weekday?.opens || "09:30",
      closes: initialData.hours.wednesday?.closes || initialData.hours.weekday?.closes || "18:00",
      closed: initialData.hours.wednesday?.closed ?? initialData.hours.weekday?.closed ?? false,
    },
    thursday: {
      opens: initialData.hours.thursday?.opens || initialData.hours.weekday?.opens || "09:30",
      closes: initialData.hours.thursday?.closes || initialData.hours.weekday?.closes || "18:00",
      closed: initialData.hours.thursday?.closed ?? initialData.hours.weekday?.closed ?? false,
    },
    friday: {
      opens: initialData.hours.friday?.opens || initialData.hours.weekday?.opens || "09:30",
      closes: initialData.hours.friday?.closes || initialData.hours.weekday?.closes || "18:00",
      closed: initialData.hours.friday?.closed ?? initialData.hours.weekday?.closed ?? false,
    },
    saturday: {
      opens: initialData.hours.saturday?.opens || "09:30",
      closes: initialData.hours.saturday?.closes || "13:00",
      closed: Boolean(initialData.hours.saturday?.closed),
    },
    sunday: {
      opens: initialData.hours.sunday?.opens || "10:00",
      closes: initialData.hours.sunday?.closes || "18:00",
      closed: initialData.hours.sunday?.closed ?? true,
    },
  });

  // Presets
  const applyCheckpotStandardPreset = () => {
    setWeekday({ opens: "09:30", closes: "18:00", closed: false });
    setSaturday({ opens: "09:30", closes: "13:00", closed: false });
    setDetailedDays({
      monday: { opens: "09:30", closes: "18:00", closed: false },
      tuesday: { opens: "09:30", closes: "18:00", closed: false },
      wednesday: { opens: "09:30", closes: "18:00", closed: false },
      thursday: { opens: "09:30", closes: "18:00", closed: false },
      friday: { opens: "09:30", closes: "18:00", closed: false },
      saturday: { opens: "09:30", closes: "13:00", closed: false },
      sunday: { opens: "10:00", closes: "18:00", closed: true },
    });
  };

  const copyMondayToWeekdays = () => {
    const mo = detailedDays.monday;
    setDetailedDays((prev) => ({
      ...prev,
      tuesday: { ...mo },
      wednesday: { ...mo },
      thursday: { ...mo },
      friday: { ...mo },
    }));
  };

  // Compute live preview list
  const getPreviewList = () => {
    if (hoursMode === "compact") {
      return [
        {
          label: "Montag – Freitag",
          value: weekday.closed ? "Geschlossen" : `${weekday.opens} – ${weekday.closes} Uhr`,
          closed: weekday.closed,
        },
        {
          label: "Samstag",
          value: saturday.closed ? "Geschlossen" : `${saturday.opens} – ${saturday.closes} Uhr`,
          closed: saturday.closed,
        },
      ];
    }

    // Detailed grouping logic
    const dayItems = DAYS.map((d) => {
      const data = detailedDays[d.key];
      return {
        key: d.key,
        label: d.label,
        closed: data.closed,
        opens: data.opens,
        closes: data.closes,
        timeKey: data.closed ? "closed" : `${data.opens}-${data.closes}`,
      };
    });

    const grouped: Array<{ label: string; value: string; closed: boolean }> = [];
    let currentGroup: typeof dayItems = [];

    for (const item of dayItems) {
      if (currentGroup.length === 0) {
        currentGroup.push(item);
      } else if (currentGroup[0].timeKey === item.timeKey) {
        currentGroup.push(item);
      } else {
        const isSingle = currentGroup.length === 1;
        const label = isSingle
          ? currentGroup[0].label
          : `${currentGroup[0].label} – ${currentGroup[currentGroup.length - 1].label}`;
        const closed = currentGroup[0].closed;
        grouped.push({
          label,
          value: closed ? "Geschlossen" : `${currentGroup[0].opens} – ${currentGroup[0].closes} Uhr`,
          closed,
        });
        currentGroup = [item];
      }
    }

    if (currentGroup.length > 0) {
      const isSingle = currentGroup.length === 1;
      const label = isSingle
        ? currentGroup[0].label
        : `${currentGroup[0].label} – ${currentGroup[currentGroup.length - 1].label}`;
      const closed = currentGroup[0].closed;
      grouped.push({
        label,
        value: closed ? "Geschlossen" : `${currentGroup[0].opens} – ${currentGroup[0].closes} Uhr`,
        closed,
      });
    }

    return grouped;
  };

  const previewList = getPreviewList();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavedSuccess(false);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("hoursMode", hoursMode);
    formData.set("hoursNote", hoursNote);

    // Set compact fields
    formData.set("weekdayOpens", weekday.opens);
    formData.set("weekdayCloses", weekday.closes);
    formData.set("weekdayClosed", String(weekday.closed));
    formData.set("saturdayOpens", saturday.opens);
    formData.set("saturdayCloses", saturday.closes);
    formData.set("saturdayClosed", String(saturday.closed));

    // Set detailed fields
    for (const day of DAYS) {
      formData.set(`${day.key}Opens`, detailedDays[day.key].opens);
      formData.set(`${day.key}Closes`, detailedDays[day.key].closes);
      formData.set(`${day.key}Closed`, String(detailedDays[day.key].closed));
    }

    startTransition(async () => {
      try {
        await saveStoreSettingsAction(formData);
        setSavedSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Fehler beim Speichern";
        setErrorMessage(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[880px]">
      {/* Feedback alerts */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <span>✓ Geschäftsdaten und Öffnungszeiten erfolgreich gespeichert! Die Website wurde aktualisiert.</span>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            className="text-xs text-emerald-600 hover:text-emerald-900 underline cursor-pointer ml-4"
          >
            Ausblenden
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
          ⚠ {errorMessage}
        </div>
      )}

      {/* 1. Geschäft & Identität */}
      <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-[#1c1917]">1. Geschäft & Inhaberin</h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Offizielle Geschäftsbezeichnung und Ansprechpartnerin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field-group">
            <label htmlFor="name">Geschäftsname *</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData.name}
              placeholder="z.B. Checkpot Damenmoden"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="owner">Inhaberin / Name *</label>
            <input
              type="text"
              id="owner"
              name="owner"
              defaultValue={initialData.owner}
              placeholder="z.B. Christa Hausmair"
              required
            />
          </div>
        </div>
      </section>

      {/* 2. Adresse */}
      <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-[#1c1917]">2. Standort & Adresse</h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Geschäftsadresse für Kundenbesuche und Google Maps Routenplanung.
          </p>
        </div>

        <div className="field-group">
          <label htmlFor="street">Straße & Hausnummer *</label>
          <input
            type="text"
            id="street"
            name="street"
            defaultValue={initialData.address.street}
            placeholder="z.B. Hietzinger Hauptstraße 10-16"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="field-group">
            <label htmlFor="postalCode">PLZ *</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              defaultValue={initialData.address.postalCode}
              placeholder="z.B. 1130"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="city">Ort / Stadt *</label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={initialData.address.city}
              placeholder="z.B. Wien"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="country">Land *</label>
            <input
              type="text"
              id="country"
              name="country"
              defaultValue={initialData.address.country}
              placeholder="z.B. AT"
              required
            />
          </div>
        </div>
      </section>

      {/* 3. Kontaktwege */}
      <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-[#1c1917]">3. Kontaktdaten</h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Direkte Erreichbarkeit per Telefon, WhatsApp und E-Mail für Kunden und Lieferanten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="field-group">
            <label htmlFor="phone">Telefonnummer *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={initialData.phone}
              placeholder="z.B. +43 1 876 54 32"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="whatsapp">WhatsApp-Nummer *</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              defaultValue={initialData.whatsapp}
              placeholder="z.B. +43 676 123 45 67"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="email">Öffentliche E-Mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={initialData.email}
              placeholder="z.B. christa.hausmair@outlook.at"
              required
            />
          </div>
        </div>
      </section>

      {/* 4. Öffnungszeiten */}
      <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">4. Öffnungszeiten</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Pflegen Sie die Öffnungszeiten im 24h-Format. Suchmaschinen (Google) und Website-Besucher werden automatisch synchronisiert.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-[#f5f5f4] border border-[#e7e5e4] rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setHoursMode("compact")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                hoursMode === "compact"
                  ? "bg-white text-[#1c1917] shadow-xs"
                  : "text-[#78716c] hover:text-[#1c1917]"
              }`}
            >
              Kompakt (Mo–Fr gebündelt)
            </button>
            <button
              type="button"
              onClick={() => setHoursMode("detailed")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                hoursMode === "detailed"
                  ? "bg-white text-[#1c1917] shadow-xs"
                  : "text-[#78716c] hover:text-[#1c1917]"
              }`}
            >
              Einzeltage (7 Tage)
            </button>
          </div>
        </div>

        {/* Schnell-Aktionen / Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f5f5f4]">
          <span className="text-xs font-medium text-[#78716c]">Schnellauswahl:</span>
          <button
            type="button"
            onClick={applyCheckpotStandardPreset}
            className="px-2.5 py-1 text-xs rounded-lg bg-[#fafaf9] border border-[#e7e5e4] text-[#44403c] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors cursor-pointer"
          >
            ★ Checkpot-Standard (09:30–18:00 / Sa bis 13:00)
          </button>
          {hoursMode === "detailed" && (
            <button
              type="button"
              onClick={copyMondayToWeekdays}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#fafaf9] border border-[#e7e5e4] text-[#44403c] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors cursor-pointer"
            >
              → Mo-Zeiten auf Di–Fr übertragen
            </button>
          )}
        </div>

        {/* COMPACT MODE */}
        {hoursMode === "compact" ? (
          <div className="flex flex-col gap-3">
            {/* Montag bis Freitag */}
            <div
              className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                weekday.closed
                  ? "bg-[#f5f5f4] border-[#e7e5e4] opacity-75"
                  : "bg-white border-[#e7e5e4] shadow-xs"
              }`}
            >
              <div>
                <div className="font-bold text-sm text-[#1c1917]">Montag bis Freitag</div>
                <div className="text-xs text-[#78716c]">Reguläre Wochentage (Mo–Fr)</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716c] font-medium">Von:</span>
                  <input
                    type="time"
                    disabled={weekday.closed}
                    value={weekday.opens}
                    onChange={(e) => setWeekday((prev) => ({ ...prev, opens: e.target.value }))}
                    className="px-2.5 py-1.5 bg-white border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] disabled:bg-[#e7e5e4] disabled:text-[#a8a29e] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716c] font-medium">Bis:</span>
                  <input
                    type="time"
                    disabled={weekday.closed}
                    value={weekday.closes}
                    onChange={(e) => setWeekday((prev) => ({ ...prev, closes: e.target.value }))}
                    className="px-2.5 py-1.5 bg-white border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] disabled:bg-[#e7e5e4] disabled:text-[#a8a29e] cursor-pointer"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#1c1917] cursor-pointer ml-2 p-1 rounded hover:bg-[#fafaf9]">
                  <input
                    type="checkbox"
                    checked={weekday.closed}
                    onChange={(e) => setWeekday((prev) => ({ ...prev, closed: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#C01718] focus:ring-[#C01718] cursor-pointer"
                  />
                  <span>Geschlossen</span>
                </label>
              </div>
            </div>

            {/* Samstag */}
            <div
              className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                saturday.closed
                  ? "bg-[#f5f5f4] border-[#e7e5e4] opacity-75"
                  : "bg-white border-[#e7e5e4] shadow-xs"
              }`}
            >
              <div>
                <div className="font-bold text-sm text-[#1c1917]">Samstag</div>
                <div className="text-xs text-[#78716c]">Wochenend-Öffnung</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716c] font-medium">Von:</span>
                  <input
                    type="time"
                    disabled={saturday.closed}
                    value={saturday.opens}
                    onChange={(e) => setSaturday((prev) => ({ ...prev, opens: e.target.value }))}
                    className="px-2.5 py-1.5 bg-white border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] disabled:bg-[#e7e5e4] disabled:text-[#a8a29e] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716c] font-medium">Bis:</span>
                  <input
                    type="time"
                    disabled={saturday.closed}
                    value={saturday.closes}
                    onChange={(e) => setSaturday((prev) => ({ ...prev, closes: e.target.value }))}
                    className="px-2.5 py-1.5 bg-white border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] disabled:bg-[#e7e5e4] disabled:text-[#a8a29e] cursor-pointer"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#1c1917] cursor-pointer ml-2 p-1 rounded hover:bg-[#fafaf9]">
                  <input
                    type="checkbox"
                    checked={saturday.closed}
                    onChange={(e) => setSaturday((prev) => ({ ...prev, closed: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#C01718] focus:ring-[#C01718] cursor-pointer"
                  />
                  <span>Geschlossen</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          /* DETAILED MODE (7 INDIVIDUAL DAYS) */
          <div className="flex flex-col gap-2.5">
            {DAYS.map((day) => {
              const data = detailedDays[day.key];
              const isWeekend = day.key === "saturday" || day.key === "sunday";

              return (
                <div
                  key={day.key}
                  className={`p-3.5 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    data.closed
                      ? "bg-[#fafaf9] border-[#e7e5e4] opacity-75"
                      : "bg-white border-[#e7e5e4] shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isWeekend ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {day.short}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#1c1917]">{day.label}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#78716c] font-medium">Von:</span>
                      <input
                        type="time"
                        disabled={data.closed}
                        value={data.opens}
                        onChange={(e) =>
                          setDetailedDays((prev) => ({
                            ...prev,
                            [day.key]: { ...prev[day.key], opens: e.target.value },
                          }))
                        }
                        className="px-2.5 py-1 bg-white border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] disabled:bg-[#e7e5e4] disabled:text-[#a8a29e] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#78716c] font-medium">Bis:</span>
                      <input
                        type="time"
                        disabled={data.closed}
                        value={data.closes}
                        onChange={(e) =>
                          setDetailedDays((prev) => ({
                            ...prev,
                            [day.key]: { ...prev[day.key], closes: e.target.value },
                          }))
                        }
                        className="px-2.5 py-1 bg-white border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] disabled:bg-[#e7e5e4] disabled:text-[#a8a29e] cursor-pointer"
                      />
                    </div>

                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1c1917] cursor-pointer ml-1 p-1 rounded hover:bg-[#fafaf9]">
                      <input
                        type="checkbox"
                        checked={data.closed}
                        onChange={(e) =>
                          setDetailedDays((prev) => ({
                            ...prev,
                            [day.key]: { ...prev[day.key], closed: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 rounded text-[#C01718] focus:ring-[#C01718] cursor-pointer"
                      />
                      <span>Geschlossen</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Zusatzhinweis */}
        <div className="field-group pt-2">
          <label htmlFor="hoursNote" className="flex items-center justify-between">
            <span>Zusatzhinweis zu Öffnungszeiten (optional)</span>
            <span className="text-xs text-[#78716c] font-normal">z.B. Feiertage oder Terminvereinbarung</span>
          </label>
          <input
            type="text"
            id="hoursNote"
            name="hoursNote"
            value={hoursNote}
            onChange={(e) => setHoursNote(e.target.value)}
            placeholder="z.B. An Feiertagen geschlossen. Beratungstermine gerne auch nach Vereinbarung."
          />
        </div>

        {/* Live-Vorschau Box */}
        <div className="mt-2 p-5 bg-[#fafaf9] border border-[#e7e5e4] rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
              👁 Live-Vorschau auf der Website
            </span>
            <span className="text-[11px] text-[#a8a29e]">
              Modus: {hoursMode === "compact" ? "Kompakt" : "Detail (automatisch gebündelt)"}
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#e7e5e4] shadow-xs flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1c1917] uppercase tracking-wider">Öffnungszeiten</h4>
            <div className="divide-y divide-[#f5f5f4]">
              {previewList.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-center text-sm">
                  <span className="text-[#44403c] font-medium">{item.label}</span>
                  <span
                    className={`font-semibold ${
                      item.closed ? "text-[#a8a29e]" : "text-[#1c1917]"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {hoursNote && (
              <p className="text-xs text-[#78716c] italic pt-2 border-t border-[#f5f5f4]">
                Hinweis: {hoursNote}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 px-6 rounded-xl bg-[#292524] text-white font-bold hover:bg-[#44403c] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Speichere Geschäftsdaten..." : "Geschäftsdaten speichern"}
        </button>
        <Link
          href="/admin"
          className="secondary-button py-3 px-6 rounded-xl font-semibold flex items-center justify-center text-center"
        >
          Zurück zur Übersicht
        </Link>
      </div>
    </form>
  );
}
