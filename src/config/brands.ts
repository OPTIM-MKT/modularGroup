import type { ImageMetadata } from "astro";

import kuartzLogo from "@/assets/logos/kuartz-surfaces.png";
import modulWoodsLogo from "@/assets/logos/modul-woods.png";
import showerWallsLogo from "@/assets/logos/shower-walls.png";
import vanityTopsLogo from "@/assets/logos/modular-vanity-tops.png";

/**
 * `key` is the palette scope written to `data-brand`; the tokens for each value
 * live in `src/styles/global.css`. `slug` is the URL segment, `assetDir` the
 * folder under `public/` where that company's downloadable files are dropped.
 */
export type BrandKey =
  | "showerWalls"
  | "modulWoods"
  | "kuartzSurfaces"
  | "modularVanityTops";

/**
 * `mark` — artwork on a transparent ground, flattened to white in dark mode.
 * `badge` — artwork that carries its own background and is never recoloured;
 *           on a light page it gets a plate so its own ground stays solid.
 */
export type LogoStyle = "mark" | "badge";

export interface Brand {
  key: BrandKey;
  slug: string;
  name: string;
  /** Trimmed to the artwork's bounding box — see `src/assets/logos/`. */
  logo: ImageMetadata;
  logoStyle: LogoStyle;
  /**
   * Optical correction applied on top of the area-normalised size in
   * `BrandMark`. A filled badge carries more weight than a wordmark of the
   * same area, so it sits a little smaller.
   */
  logoScale: number;
  /** Hex used for the dot/rule that identifies the company on neutral ground. */
  swatch: string;
  /** Public folder holding this company's downloadable files. */
  assetDir: string;
  /** Where the brand sits in the header: two logos flank the group mark. */
  side: "left" | "right";
  order: number;
}

export const BRANDS: readonly Brand[] = [
  {
    key: "showerWalls",
    slug: "shower-walls",
    name: "Shower Walls",
    logo: showerWallsLogo,
    logoStyle: "mark",
    logoScale: 1,
    swatch: "#006da6",
    assetDir: "showerWalls",
    side: "left",
    order: 1,
  },
  {
    key: "modulWoods",
    slug: "modul-woods",
    name: "Modul Woods",
    logo: modulWoodsLogo,
    logoStyle: "mark",
    logoScale: 1.08,
    swatch: "#f48220",
    assetDir: "modulWoods",
    side: "left",
    order: 2,
  },
  {
    key: "kuartzSurfaces",
    slug: "kuartz-surfaces",
    name: "Küartz Surfaces",
    logo: kuartzLogo,
    logoStyle: "badge",
    logoScale: 0.92,
    swatch: "#2e6b3d",
    assetDir: "kuartzSurfaces",
    side: "right",
    order: 3,
  },
  {
    key: "modularVanityTops",
    slug: "modular-vanity-tops",
    name: "Modular Vanity Tops",
    logo: vanityTopsLogo,
    logoStyle: "badge",
    logoScale: 0.92,
    swatch: "#d4af58",
    assetDir: "modularVanityTops",
    side: "right",
    order: 4,
  },
] as const;

export const getBrand = (key: BrandKey): Brand =>
  BRANDS.find((brand) => brand.key === key)!;

export const brandsOn = (side: Brand["side"]): Brand[] =>
  BRANDS.filter((brand) => brand.side === side).sort(
    (a, b) => a.order - b.order,
  );
