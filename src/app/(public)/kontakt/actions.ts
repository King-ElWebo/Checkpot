"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema, type ContactActionState } from "@/lib/validations/contact";

const SENDER_EMAIL = "Checkpot Website <website@checkpot-hietzing.at>";
const RECIPIENT_EMAIL = "christa.hausmair@outlook.at";

// Simple burst rate limiter: max 5 requests per 10 minutes per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipSubmissions = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubmissions.get(ip);

  if (!entry || now > entry.expiresAt) {
    ipSubmissions.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactMessageAction(
  prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  // 1. Extract IP for rate limiting
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";

  if (clientIp !== "unknown-ip" && isRateLimited(clientIp)) {
    return {
      success: false,
      message:
        "Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten oder kontaktieren Sie uns direkt telefonisch.",
    };
  }

  // 2. Parse & Validate FormData with Zod
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    companyWebsite: formData.get("companyWebsite"),
  };

  const parsed = contactSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte überprüfen Sie Ihre Eingaben in den markierten Feldern.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // 3. Honeypot check: If bot filled the hidden honeypot field, silently return success without sending email
  if (data.companyWebsite && data.companyWebsite.trim() !== "") {
    // Fake success for bots
    return {
      success: true,
      message: "Vielen Dank! Ihre Nachricht wurde erfolgreich übermittelt.",
      submittedAt: Date.now(),
    };
  }

  // 4. Verify Resend Configuration
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  if (!resendApiKey) {
    console.warn(
      "[Contact Form Action] RESEND_API_KEY is not configured in the environment. Email delivery is disabled."
    );
    return {
      success: false,
      message:
        "Der E-Mail-Dienst ist derzeit nicht konfiguriert. Bitte kontaktieren Sie uns telefonisch oder direkt per E-Mail.",
    };
  }

  // 5. Dispatch Email via Resend (Zero DB persistence)
  try {
    const resend = new Resend(resendApiKey);

    const timestamp = new Date().toLocaleString("de-AT", {
      timeZone: "Europe/Vienna",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const plainTextMessage = `Neue Kontaktanfrage über checkpot-hietzing.at

Name: ${data.name}
E-Mail: ${data.email}
Telefon: ${data.phone || "Keine Angabe"}
Eingegangen am: ${timestamp}

Nachricht:
--------------------------------------------------
${data.message}
--------------------------------------------------`;

    const htmlMessage = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #C01718; margin-top: 0; font-size: 20px; font-weight: 700;">Neue Kontaktanfrage</h2>
  <p style="font-size: 14px; color: #718096; margin-bottom: 24px;">Über das Kontaktformular auf checkpot-hietzing.at eingegangen.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 15px;">
    <tr>
      <td style="padding: 8px 0; color: #718096; width: 100px;"><strong>Name:</strong></td>
      <td style="padding: 8px 0; color: #1a1a1a;">${escapeHtml(data.name)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #718096;"><strong>E-Mail:</strong></td>
      <td style="padding: 8px 0; color: #1a1a1a;"><a href="mailto:${escapeHtml(data.email)}" style="color: #C01718; text-decoration: none;">${escapeHtml(data.email)}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #718096;"><strong>Telefon:</strong></td>
      <td style="padding: 8px 0; color: #1a1a1a;">${data.phone ? escapeHtml(data.phone) : '<span style="color: #a0aec0;">Keine Angabe</span>'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #718096;"><strong>Eingegangen:</strong></td>
      <td style="padding: 8px 0; color: #1a1a1a;">${timestamp}</td>
    </tr>
  </table>

  <div style="background-color: #f9f9f8; border-left: 4px solid #C01718; padding: 16px; border-radius: 0 4px 4px 0; margin-top: 16px;">
    <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #4a5568;">Nachricht:</h3>
    <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #1a1a1a;">${escapeHtml(data.message)}</p>
  </div>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 16px 0;" />
  <p style="font-size: 12px; color: #a0aec0; margin: 0;">Diese Nachricht wurde automatisch von der Checkpot Website übermittelt. Durch Klicken auf „Antworten“ schreiben Sie direkt an ${escapeHtml(data.email)}.</p>
</div>`;

    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [RECIPIENT_EMAIL],
      replyTo: data.email,
      subject: `Neue Kontaktanfrage über Website – ${data.name}`,
      text: plainTextMessage,
      html: htmlMessage,
    });

    if (error) {
      console.error("[Contact Form Action] Resend provider error:", error.name, error.message);
      return {
        success: false,
        message:
          "Die Nachricht konnte gerade nicht gesendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch bzw. per E-Mail.",
      };
    }

    return {
      success: true,
      message:
        "Vielen Dank! Ihre Nachricht wurde erfolgreich an uns übermittelt. Wir melden uns schnellstmöglich bei Ihnen.",
      submittedAt: Date.now(),
    };
  } catch (err: unknown) {
    console.error("[Contact Form Action] Unexpected exception during email dispatch:", err instanceof Error ? err.message : err);
    return {
      success: false,
      message:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie uns telefonisch oder direkt per E-Mail.",
    };
  }
}
