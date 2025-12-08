import { IntlayerServer } from "next-intlayer/server";
import { Locales } from "intlayer";

export default IntlayerServer;

export async function generateStaticParams() {
  return Object.values(Locales)
    .filter((locale) => typeof locale === "string")
    .map((locale) => ({ locale }));
}

export const dynamicParams = false;
