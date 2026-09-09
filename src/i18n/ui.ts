/**
 * English is the default locale and is served without a prefix (`/contact`);
 * Spanish lives under `/es/`. Keep this in sync with `i18n` in astro.config.mjs.
 */
export const LANGUAGES = {
  en: { code: "en", short: "EN", name: "English", htmlLang: "en-US" },
  es: { code: "es", short: "ES", name: "Español", htmlLang: "es-MX" },
} as const;

export type Lang = keyof typeof LANGUAGES;

export const LANG_CODES = Object.keys(LANGUAGES) as Lang[];

export const defaultLang: Lang = "en";
export const showDefaultLang = false;

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && value in LANGUAGES;
