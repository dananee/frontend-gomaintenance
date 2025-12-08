import { Locales, type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.FRENCH, Locales.ARABIC],
    defaultLocale: Locales.FRENCH,
  },
  routing: {
    mode: "prefix-all", // Enable locale prefix in URLs for all locales
  },
  content: {
    // Where to look for translation files
    fileExtensions: [".intlayer.json", ".intlayer.ts", ".intlayer.tsx"],
    baseDir: ".intlayer",
  },
};

export default config;
