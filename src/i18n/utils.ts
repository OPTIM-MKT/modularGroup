import { defaultLang, isLang, showDefaultLang, type Lang } from "./ui";

/** Reads the locale out of `/es/contact` — falls back to the default locale. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");
  return isLang(maybeLang) ? maybeLang : defaultLang;
}

/** Strips the locale prefix: `/es/contact` -> `/contact`, `/` -> `/`. */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLang(segments[0])) segments.shift();
  return `/${segments.join("/")}`;
}

/**
 * Builds a locale-aware href. Pass paths in their canonical (English-prefixed)
 * form — `localePath("es", "/contact")` -> `/es/contact`.
 */
export function localePath(lang: Lang, path = "/"): string {
  const clean = stripLocale(path.startsWith("/") ? path : `/${path}`);
  const isRoot = clean === "/";

  if (lang === defaultLang && !showDefaultLang) return clean;
  return isRoot ? `/${lang}` : `/${lang}${clean}`;
}

/** Same page, other language — what the language toggle links to. */
export function switchLocalePath(url: URL, lang: Lang): string {
  return localePath(lang, url.pathname);
}

/** `useTranslatedPath` bound to a locale, for components that build many links. */
export function useTranslatedPath(lang: Lang) {
  return (path: string) => localePath(lang, path);
}
