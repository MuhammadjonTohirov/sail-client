import { apiFetch } from './apiUtils';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  is_default: boolean;
}

export interface ExchangeRates {
  [fromCurrency: string]: {
    [toCurrency: string]: number;
  };
}

export interface CurrencyConfig {
  currencies: Currency[];
  exchange_rates: ExchangeRates;
  default_currency: string;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  converted: number;
  rate: number;
}

export const CurrencyApi = {
  /**
   * Get currency configuration (currencies and exchange rates)
   * This should be called once on app initialization and cached
   */
  async getConfig(): Promise<CurrencyConfig> {
    return await apiFetch('/api/v1/currency/config');
  },

  /**
   * Convert amount from one currency to another
   * Note: Client-side conversion using cached rates is preferred
   */
  async convert(amount: number, from: string, to: string): Promise<ConversionResult> {
    return await apiFetch(`/api/v1/currency/convert?amount=${amount}&from=${from}&to=${to}`);
  },
};
