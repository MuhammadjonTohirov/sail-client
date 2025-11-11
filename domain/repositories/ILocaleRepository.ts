export interface ILocaleRepository {
  getCurrentLocale(): string;
  getSupportedLocales(): string[];
}
