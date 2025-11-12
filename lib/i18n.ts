"use client";
import { useTranslation } from "react-i18next";
import { useLocaleContext } from "@/context/LocaleContext";

export function useI18n() {
  const { locale, setLocale } = useLocaleContext();
  const { t } = useTranslation(undefined, { lng: locale });
  return { t, locale, setLocale };
}
