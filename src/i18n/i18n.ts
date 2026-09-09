import en from "@/constants/en.json";
import es from "@/constants/es.json";

import { defaultLang, isLang, type Lang } from "./ui";

/** English is the source of truth for the shape of every dictionary. */
export type Dictionary = typeof en;

const DICTIONARIES: Record<Lang, Dictionary> = {
  en,
  es: es as Dictionary,
};

export const getLang = (currentLocale?: string | undefined): Lang =>
  isLang(currentLocale) ? currentLocale : defaultLang;

/** Astro components: `const t = getI18N(Astro.currentLocale)`. */
export const getI18N = (currentLocale?: string | undefined): Dictionary =>
  DICTIONARIES[getLang(currentLocale)];

export const getDictionary = (lang: Lang): Dictionary => DICTIONARIES[lang];
