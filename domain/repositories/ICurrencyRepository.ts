import { CurrencyConfig, ConversionResult } from '../models/Currency';

export interface ICurrencyRepository {
  getConfig(): Promise<CurrencyConfig>;
  convert(amount: number, from: string, to: string): Promise<ConversionResult>;
}
