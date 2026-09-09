// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

import icon from "astro-icon";

export default defineConfig({
  site: "https://basic.com",
  output: "server",
  adapter: netlify({
    imageCDN: false,
  }),

  integrations: [
    react(),
    icon(),
    robotsTxt(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          es: "es-MX",
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
