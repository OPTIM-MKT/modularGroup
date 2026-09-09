import type { BrandKey } from "./brands";
import type { Lang } from "@/i18n/ui";

/**
 * Downloadable files, one entry per document.
 *
 * `file` is the path **inside** the company folder in `public/`, so a new
 * catalog only needs to be dropped in `public/<assetDir>/` and listed here.
 * `size` is shown to the user before they commit to the download — keep it
 * updated when a file is replaced, or omit it.
 */
export interface DownloadItem {
  file: string;
  label: Record<Lang, string>;
  description?: Record<Lang, string>;
  size?: string;
  /** Defaults to the file extension, uppercased. */
  kind?: string;
}

export const DOWNLOADS: Record<BrandKey, readonly DownloadItem[]> = {
  showerWalls: [
    {
      file: "Shower-Walls-Catalog.pdf",
      label: { en: "Shower Walls catalog", es: "Catálogo Shower Walls" },
      description: {
        en: "Wall panel systems, finishes and installation details.",
        es: "Sistemas de paneles de muro, acabados y detalles de instalación.",
      },
      size: "7.8 MB",
    },
    {
      file: "Shower-Pans-Catalog.pdf",
      label: { en: "Shower Pans catalog", es: "Catálogo de platos de ducha" },
      description: {
        en: "Shower pan sizes, drains and configurations.",
        es: "Medidas de platos, drenajes y configuraciones.",
      },
      size: "2.5 MB",
    },
  ],
  modulWoods: [
    {
      file: "Kitchen-Solutions-Catalog.pdf",
      label: { en: "Kitchen Solutions catalog", es: "Catálogo Kitchen Solutions" },
      description: {
        en: "Frameless cabinetry ranges, door styles and finishes.",
        es: "Líneas de gabinetes sin marco, estilos de puerta y acabados.",
      },
      size: "1.5 MB",
    },
  ],
  kuartzSurfaces: [
    {
      file: "Kuartz-Catalog-2025.pdf",
      label: { en: "Küartz catalog 2025", es: "Catálogo Küartz 2025" },
      description: {
        en: "The full quartz colour range, slab sizes and finishes.",
        es: "Gama completa de colores de cuarzo, medidas de placa y acabados.",
      },
      size: "20.8 MB",
    },
  ],
  modularVanityTops: [
    {
      file: "CATALOG-MVT-2025.pdf",
      label: { en: "Vanity Tops catalog 2025", es: "Catálogo Vanity Tops 2025" },
      description: {
        en: "Models, bowl options, colours and edge profiles.",
        es: "Modelos, opciones de lavabo, colores y perfiles de canto.",
      },
      size: "5.3 MB",
    },
  ],
};

export interface ResolvedDownload {
  href: string;
  label: string;
  description?: string;
  size?: string;
  kind: string;
  fileName: string;
}

/** Turns the config above into ready-to-render, locale-aware links. */
export function getDownloads(
  brandKey: BrandKey,
  assetDir: string,
  lang: Lang,
): ResolvedDownload[] {
  return (DOWNLOADS[brandKey] ?? []).map((item) => ({
    href: `/${assetDir}/${item.file}`,
    label: item.label[lang],
    description: item.description?.[lang],
    size: item.size,
    kind: item.kind ?? (item.file.split(".").pop() ?? "file").toUpperCase(),
    fileName: item.file,
  }));
}
