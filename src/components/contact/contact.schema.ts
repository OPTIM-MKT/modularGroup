import { z } from "zod";

export const INTERESTS = [
  "group",
  "showerWalls",
  "modulWoods",
  "kuartzSurfaces",
  "modularVanityTops",
] as const;

export type InterestKey = (typeof INTERESTS)[number];

export const INTEREST_LABELS: Record<InterestKey, string> = {
  group: "Modular Group general",
  showerWalls: "Shower Walls",
  modulWoods: "Modul Woods",
  kuartzSurfaces: "Küartz Surfaces",
  modularVanityTops: "Modular Vanity Tops",
};

export function getInterestLabel(value?: string): string {
  if (!value) return "";
  return INTEREST_LABELS[value as InterestKey] ?? value;
}

export interface ContactMessages {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  message?: string;
  tooLong?: string;
}

/** Schema builder accepting localized or custom validation messages. */
export const buildContactSchema = (m?: ContactMessages) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, m?.name ?? "Please enter your name.")
      .max(120, m?.tooLong ?? "This field is too long."),
    email: z
      .email(m?.email ?? "Please enter a valid email address.")
      .max(160, m?.tooLong ?? "This field is too long."),
    phone: z
      .string()
      .trim()
      .max(40, m?.tooLong ?? "This field is too long.")
      .optional()
      .or(z.literal("")),
    company: z
      .string()
      .trim()
      .max(140, m?.tooLong ?? "This field is too long.")
      .optional()
      .or(z.literal("")),
    interest: z.enum(
      INTERESTS,
      m?.interest ? { message: m.interest } : undefined,
    ),
    message: z
      .string()
      .trim()
      .min(10, m?.message ?? "Please tell us a little more (at least 10 characters).")
      .max(4000, m?.tooLong ?? "This field is too long."),
    /** Honeypot - must stay empty for humans. */
    website: z.string().max(0).optional().or(z.literal("")),
    locale: z.string().max(10).optional(),
  });

/** Default contact schema for server actions & validation */
export const contactSchema = buildContactSchema();

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactPayload = ContactFormData;
