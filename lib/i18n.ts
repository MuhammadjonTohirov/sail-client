"use client";
import { useTranslation } from 'react-i18next';
import type { Locale } from '@/i18n/config';
import { useLocaleContext } from '@/context/LocaleContext';

export function useI18n() {
  const { locale, setLocale } = useLocaleContext();
  const { t } = useTranslation();

  return { t, locale: locale as Locale, setLocale };
}
