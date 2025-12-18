import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async (params) => {
  const locale = params.locale;
  const activeLocale = (locale as string) || "fr";

  return {
    locale: activeLocale,
    messages: (await import(`../../messages/${activeLocale}.json`)).default,
  };
});
