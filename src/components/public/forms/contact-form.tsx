"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { ContactFormPayload, ContactFormState } from "@/lib/contracts/public";

type FieldErrors = Partial<Record<keyof ContactFormPayload, string>>;

const initialPayload: ContactFormPayload = {
  name: "",
  surname: "",
  email: "",
  message: "",
};

function validate(payload: ContactFormPayload) {
  const errors: FieldErrors = {};

  if (payload.name.trim().length < 2) {
    errors.name = "Bitte geben Sie Ihren Vornamen an.";
  }

  if (payload.surname.trim().length < 2) {
    errors.surname = "Bitte geben Sie Ihren Nachnamen an.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  }

  if (payload.message.trim().length < 12) {
    errors.message = "Bitte schreiben Sie kurz, worum es geht.";
  }

  return errors;
}

export function ContactForm() {
  const [payload, setPayload] = useState<ContactFormPayload>(initialPayload);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<ContactFormState>("idle");

  const isSubmitting = state === "submitting";
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function updateField(field: keyof ContactFormPayload, value: string) {
    setPayload((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (state !== "idle") {
      setState("idle");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(payload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setState("validation-error");
      return;
    }

    setState("submitting");
    window.setTimeout(() => {
      if (payload.message.toLowerCase().includes("fehler")) {
        setState("server-error");
        return;
      }

      setState("success");
      setPayload(initialPayload);
    }, 700);
  }

  return (
    <form className="contact-form" noValidate onSubmit={submit}>
      <div className="form-grid">
        <label className="form-field">
          <span>Vorname</span>
          <input
            autoComplete="given-name"
            disabled={isSubmitting}
            name="name"
            value={payload.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(event) => updateField("name", event.target.value)}
          />
          {errors.name ? <small id="name-error">{errors.name}</small> : null}
        </label>
        <label className="form-field">
          <span>Nachname</span>
          <input
            autoComplete="family-name"
            disabled={isSubmitting}
            name="surname"
            value={payload.surname}
            aria-invalid={Boolean(errors.surname)}
            aria-describedby={errors.surname ? "surname-error" : undefined}
            onChange={(event) => updateField("surname", event.target.value)}
          />
          {errors.surname ? <small id="surname-error">{errors.surname}</small> : null}
        </label>
      </div>
      <label className="form-field">
        <span>E-Mail</span>
        <input
          autoComplete="email"
          disabled={isSubmitting}
          inputMode="email"
          name="email"
          type="email"
          value={payload.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={(event) => updateField("email", event.target.value)}
        />
        {errors.email ? <small id="email-error">{errors.email}</small> : null}
      </label>
      <label className="form-field">
        <span>Nachricht</span>
        <textarea
          disabled={isSubmitting}
          name="message"
          rows={6}
          value={payload.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={(event) => updateField("message", event.target.value)}
        />
        {errors.message ? <small id="message-error">{errors.message}</small> : null}
      </label>
      <div aria-live="polite" className="form-status">
        {state === "success" ? "Danke. Ihre Nachricht ist als Frontend-Bestätigung sichtbar vorbereitet." : null}
        {state === "server-error"
          ? "Die Nachricht konnte gerade nicht gesendet werden. Telefon, E-Mail und WhatsApp bleiben als Alternativen sichtbar."
          : null}
        {state === "validation-error" && hasErrors ? "Bitte prüfen Sie die markierten Felder." : null}
      </div>
      <button className="public-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Wird gesendet ..." : "Nachricht vorbereiten"}
      </button>
    </form>
  );
}
