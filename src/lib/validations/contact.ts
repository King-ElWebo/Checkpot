import { z } from "zod";

const emptyStringToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie Ihren Namen ein")
    .max(100, "Name darf maximal 100 Zeichen lang sein"),
  email: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein")
    .max(100, "E-Mail darf maximal 100 Zeichen lang sein"),
  phone: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .trim()
      .max(50, "Telefonnummer darf maximal 50 Zeichen lang sein")
      .optional()
  ),
  message: z
    .string()
    .trim()
    .min(10, "Ihre Nachricht sollte mindestens 10 Zeichen lang sein")
    .max(3000, "Ihre Nachricht darf maximal 3000 Zeichen lang sein"),
  companyWebsite: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    message?: string[];
  };
  submittedAt?: number;
};
