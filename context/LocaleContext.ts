import { createContext, useContext } from "react";
import type { Locale } from "@/i18n/config";
import { appConfig } from "@/config";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const supportedLocales: Locale[] = ["ru", "uz"];
const defaultLocale: Locale = supportedLocales.includes(
  appConfig.i18n.defaultLocale as Locale
)
  ? (appConfig.i18n.defaultLocale as Locale)
  : "ru";

export const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function useLocaleContext() {
  return useContext(LocaleContext);
}
