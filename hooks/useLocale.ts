import { useMemo } from 'react';
import { GetCurrentLocaleUseCase } from '@/domain/usecases/locale/GetCurrentLocaleUseCase';
import { LocaleRepositoryImpl } from '@/data/repositories/LocaleRepositoryImpl';

export function useLocale() {
  const repository = useMemo(() => new LocaleRepositoryImpl(), []);
  const getCurrentLocaleUseCase = useMemo(() => new GetCurrentLocaleUseCase(repository), [repository]);

  const currentLocale = useMemo(() => {
    return getCurrentLocaleUseCase.execute();
  }, [getCurrentLocaleUseCase]);

  const supportedLocales = useMemo(() => {
    return repository.getSupportedLocales();
  }, [repository]);

  return {
    currentLocale,
    supportedLocales,
  };
}
