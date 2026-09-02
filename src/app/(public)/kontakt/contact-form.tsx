"use client";

import { useActionState, useState, useRef } from "react";
import { sendContactMessageAction } from "./actions";
import type { ContactActionState } from "@/lib/validations/contact";

const initialState: ContactActionState = {
  success: false,
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessageAction, initialState);
  const [dismissedTimestamp, setDismissedTimestamp] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showSuccess = Boolean(
    state.success && state.submittedAt && state.submittedAt !== dismissedTimestamp
  );

  if (showSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="py-6 sm:py-8 flex flex-col items-start gap-4 text-[#1A1A1A]"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#C01718] text-white flex items-center justify-center font-bold text-sm">
            ✓
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
            Nachricht erfolgreich gesendet
          </h3>
        </div>

        <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#4A5568] max-w-lg">
          {state.message ||
            "Vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns persönlich bei Ihnen."}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setDismissedTimestamp(state.submittedAt || Date.now())}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 ease-out hover:bg-[#C01718] cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
          >
            Weitere Nachricht schreiben
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form ref={formRef} action={formAction} className="space-y-6 sm:space-y-7" noValidate>
        {/* Global Error Banner */}
        {!state.success && state.message && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-sm text-[#991B1B] text-sm leading-relaxed"
          >
            <div className="font-medium">{state.message}</div>
          </div>
        )}

        {/* Honeypot field (hidden trap for spam bots) */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="companyWebsite">Webseite</label>
          <input
            type="text"
            name="companyWebsite"
            id="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="space-y-5 sm:space-y-6">
          {/* Name & Email 2-column row on tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4A5568]"
              >
                Name <span className="text-[#C01718]">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                required
                disabled={isPending}
                aria-invalid={Boolean(state.fieldErrors?.name)}
                aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
                className={`block w-full rounded-sm border ${
                  state.fieldErrors?.name ? "border-[#C01718] bg-[#FFF8F8]" : "border-[#E2E8F0] bg-white"
                } px-4 py-3.5 text-[#1A1A1A] placeholder:text-[#9E988F] text-[15px] sm:text-[16px] focus:bg-white focus:border-[#C01718] focus:outline-hidden focus:ring-1 focus:ring-[#C01718] transition-colors`}
                placeholder="Ihr vollständiger Name"
              />
              {state.fieldErrors?.name && (
                <p id="name-error" className="mt-1.5 text-xs text-[#C01718] font-medium">
                  {state.fieldErrors.name[0]}
                </p>
              )}
            </div>

            {/* E-Mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4A5568]"
              >
                E-Mail <span className="text-[#C01718]">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                disabled={isPending}
                aria-invalid={Boolean(state.fieldErrors?.email)}
                aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
                className={`block w-full rounded-sm border ${
                  state.fieldErrors?.email ? "border-[#C01718] bg-[#FFF8F8]" : "border-[#E2E8F0] bg-white"
                } px-4 py-3.5 text-[#1A1A1A] placeholder:text-[#9E988F] text-[15px] sm:text-[16px] focus:bg-white focus:border-[#C01718] focus:outline-hidden focus:ring-1 focus:ring-[#C01718] transition-colors`}
                placeholder="ihre.adresse@beispiel.at"
              />
              {state.fieldErrors?.email && (
                <p id="email-error" className="mt-1.5 text-xs text-[#C01718] font-medium">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>
          </div>

          {/* Phone (optional) */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4A5568]"
            >
              Telefon <span className="text-[#718096] font-normal normal-case tracking-normal text-[12px] ml-1">(optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              autoComplete="tel"
              disabled={isPending}
              aria-invalid={Boolean(state.fieldErrors?.phone)}
              aria-describedby={state.fieldErrors?.phone ? "phone-error" : undefined}
              className={`block w-full rounded-sm border ${
                state.fieldErrors?.phone ? "border-[#C01718] bg-[#FFF8F8]" : "border-[#E2E8F0] bg-white"
              } px-4 py-3.5 text-[#1A1A1A] placeholder:text-[#9E988F] text-[15px] sm:text-[16px] focus:bg-white focus:border-[#C01718] focus:outline-hidden focus:ring-1 focus:ring-[#C01718] transition-colors`}
              placeholder="z.B. 0676 1234567"
            />
            {state.fieldErrors?.phone && (
              <p id="phone-error" className="mt-1.5 text-xs text-[#C01718] font-medium">
                {state.fieldErrors.phone[0]}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-[11.5px] 2xl:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4A5568]"
            >
              Nachricht <span className="text-[#C01718]">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              required
              disabled={isPending}
              aria-invalid={Boolean(state.fieldErrors?.message)}
              aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
              className={`block w-full rounded-sm border ${
                state.fieldErrors?.message ? "border-[#C01718] bg-[#FFF8F8]" : "border-[#E2E8F0] bg-white"
              } p-4 text-[#1A1A1A] placeholder:text-[#9E988F] text-[15px] sm:text-[16px] focus:bg-white focus:border-[#C01718] focus:outline-hidden focus:ring-1 focus:ring-[#C01718] transition-colors resize-y min-h-[140px] max-h-[220px]`}
              placeholder="Wie können wir Ihnen weiterhelfen?"
            />
            {state.fieldErrors?.message && (
              <p id="message-error" className="mt-1.5 text-xs text-[#C01718] font-medium">
                {state.fieldErrors.message[0]}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex cursor-pointer items-center justify-center rounded-sm bg-[#C01718] px-8 2xl:px-9 py-4 text-[13px] 2xl:text-[13.5px] font-medium uppercase tracking-[0.08em] text-white !text-white transition-colors duration-200 ease-out hover:bg-[#A01314] hover:text-white hover:!text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8] disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Wird gesendet...
              </span>
            ) : (
              <>
                Nachricht senden <span className="ml-1.5" aria-hidden="true">→</span>
              </>
            )}
          </button>

          <span className="text-[12.5px] text-[#718096]">
            Wir melden uns persönlich bei Ihnen.
          </span>
        </div>
      </form>
    </div>
  );
}
