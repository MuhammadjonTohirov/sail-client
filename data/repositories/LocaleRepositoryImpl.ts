import { ILocaleRepository } from '../../domain/repositories/ILocaleRepository';
import { currentLocale } from '../../lib/apiUtils';
import { appConfig } from '@/config';

export class LocaleRepositoryImpl implements ILocaleRepository {
  getCurrentLocale(): string {
    return currentLocale();
  }

  getSupportedLocales(): string[] {
    return [...appConfig.i18n.locales];
  }
}
