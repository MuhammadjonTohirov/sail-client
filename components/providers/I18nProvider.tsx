"use client";
import { I18nextProvider } from "react-i18next";
import i18next from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { ReactNode, useCallback, useMemo, useState, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { appConfig } from "@/config";

const supportedLocales: Locale[] = ["ru", "uz"];
const fallbackLocale: Locale = supportedLocales.includes(
  appConfig.i18n.defaultLocale as Locale
)
  ? (appConfig.i18n.defaultLocale as Locale)
  : "ru";

type Props = {
  children: ReactNode;
  initialLocale?: Locale;
};

const persistLocalePreference = (next: Locale) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("locale", next);
  }
  if (typeof document !== "undefined") {
    console.log(next);
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
  }
};

export default function I18nProvider({ children, initialLocale }: Props) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? fallbackLocale
  );

  useEffect(() => {
    if (initialLocale) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem("locale");
    if (stored && supportedLocales.includes(stored as Locale)) {
      setLocaleState(stored as Locale);
      persistLocalePreference(stored as Locale);
    }
  }, [initialLocale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (!supportedLocales.includes(next) || next === locale) return;
      setLocaleState(next);
    },
    [locale]
  );

  useEffect(() => {
    if (i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
    persistLocalePreference(locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale]
  );
  return (
    <LocaleContext.Provider value={value}>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  );
}
