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
        className="p-8 bg-[#FAF9F6] border border-[#EDEAE4] rounded-sm flex flex-col gap-4 text-[#1A1A1A] outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <h3 className="font-display text-2xl font-normal text-[#1A1A1A]">
            Nachricht erfolgreich gesendet
          </h3>
        </div>

        <p className="text-[15px] leading-relaxed text-[#4A5568]">
          {state.message ||
            "Vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns so schnell wie möglich bei Ihnen."}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setDismissedTimestamp(state.submittedAt || Date.now())}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-6 py-3 text-[12.5px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 cursor-pointer"
          >
            Weitere Nachricht schreiben
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
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

      {/* Honeypot field (hidden for users and screen readers, trap for spam bots) */}
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

      <div className="space-y-5">
        {/* Name & Email in 2-column row on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-[11.5px] font-mono font-medium uppercase tracking-[0.1em] text-[#1A1A1A]"
            >
              Name *
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
              className={`block w-full border-0 border-b ${
                state.fieldErrors?.name ? "border-[#C01718]" : "border-[#E5E2DC]"
              } bg-transparent py-2.5 px-0 text-[#1A1A1A] placeholder:text-[#A0AEC0] focus:border-[#1A1A1A] focus:ring-0 sm:text-[15px] transition-colors`}
              placeholder="Ihr Name"
            />
            {state.fieldErrors?.name && (
              <p id="name-error" className="mt-1 text-xs text-[#C01718] font-medium">
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>

          {/* E-Mail */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[11.5px] font-mono font-medium uppercase tracking-[0.1em] text-[#1A1A1A]"
            >
              E-Mail *
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
              className={`block w-full border-0 border-b ${
                state.fieldErrors?.email ? "border-[#C01718]" : "border-[#E5E2DC]"
              } bg-transparent py-2.5 px-0 text-[#1A1A1A] placeholder:text-[#A0AEC0] focus:border-[#1A1A1A] focus:ring-0 sm:text-[15px] transition-colors`}
              placeholder="ihre.adresse@beispiel.at"
            />
            {state.fieldErrors?.email && (
              <p id="email-error" className="mt-1 text-xs text-[#C01718] font-medium">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>
        </div>

        {/* Phone (optional) */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-[11.5px] font-mono font-medium uppercase tracking-[0.1em] text-[#1A1A1A]"
          >
            Telefon <span className="text-[#A0AEC0] font-normal normal-case font-sans">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            autoComplete="tel"
            disabled={isPending}
            aria-invalid={Boolean(state.fieldErrors?.phone)}
            aria-describedby={state.fieldErrors?.phone ? "phone-error" : undefined}
            className={`block w-full border-0 border-b ${
              state.fieldErrors?.phone ? "border-[#C01718]" : "border-[#E5E2DC]"
            } bg-transparent py-2.5 px-0 text-[#1A1A1A] placeholder:text-[#A0AEC0] focus:border-[#1A1A1A] focus:ring-0 sm:text-[15px] transition-colors`}
            placeholder="z.B. 0676 1234567"
          />
          {state.fieldErrors?.phone && (
            <p id="phone-error" className="mt-1 text-xs text-[#C01718] font-medium">
              {state.fieldErrors.phone[0]}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-[11.5px] font-mono font-medium uppercase tracking-[0.1em] text-[#1A1A1A]"
          >
            Nachricht *
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            disabled={isPending}
            aria-invalid={Boolean(state.fieldErrors?.message)}
            aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
            className={`block w-full border-0 border-b ${
              state.fieldErrors?.message ? "border-[#C01718]" : "border-[#E5E2DC]"
            } bg-transparent py-2.5 px-0 text-[#1A1A1A] placeholder:text-[#A0AEC0] focus:border-[#1A1A1A] focus:ring-0 sm:text-[15px] resize-y transition-colors min-h-[130px] max-h-[220px]`}
            placeholder="Wie können wir Ihnen weiterhelfen?"
          />
          {state.fieldErrors?.message && (
            <p id="message-error" className="mt-1 text-xs text-[#C01718] font-medium">
              {state.fieldErrors.message[0]}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center justify-center rounded-sm bg-[#C01718] px-7 py-3.5 text-[12.5px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
      </div>
    </form>
  );
}
