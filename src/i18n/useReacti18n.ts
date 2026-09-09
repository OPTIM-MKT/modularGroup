import { getDictionary, type Dictionary } from "./i18n";
import { defaultLang, isLang, type Lang } from "./ui";

/**
 * i18n for React islands. The locale is passed down from Astro at render time;
 * the pathname sniff is only a fallback for islands mounted without a prop.
 */
export function useReactI18n(initialLang?: string): {
  t: Dictionary;
  lang: Lang;
} {
  const lang = resolveLang(initialLang);
  return { t: getDictionary(lang), lang };
}

function resolveLang(initialLang?: string): Lang {
  if (isLang(initialLang)) return initialLang;

  if (typeof window !== "undefined") {
    const [, segment] = window.location.pathname.split("/");
    if (isLang(segment)) return segment;
  }

  return defaultLang;
}
