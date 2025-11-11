"use client";
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { LocaleContext } from '@/context/LocaleContext';
import { appConfig } from '@/config';

const supportedLocales: Locale[] = ['ru', 'uz'];
const fallbackLocale: Locale = supportedLocales.includes(appConfig.i18n.defaultLocale as Locale)
  ? (appConfig.i18n.defaultLocale as Locale)
  : 'ru';

const detectInitialLocale = (): Locale => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('locale');
    if (stored && supportedLocales.includes(stored as Locale)) {
      return stored as Locale;
    }
    const browserLang = window.navigator.language.toLowerCase();
    if (browserLang.startsWith('uz')) return 'uz';
    return 'ru';
  }
  return fallbackLocale;
};

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    if (!supportedLocales.includes(next)) return;
    setLocaleState(next);
  }, []);

  useEffect(() => {
    if (i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', locale);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  );
}
