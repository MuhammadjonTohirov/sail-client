import { createContext, useContext } from 'react';
import type { Locale } from '@/i18n/config';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ru',
  setLocale: () => {},
});

export function useLocaleContext() {
  return useContext(LocaleContext);
}

