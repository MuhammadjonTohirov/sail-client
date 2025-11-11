export interface Currency {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly isDefault: boolean;
}

export interface ExchangeRates {
  readonly [fromCurrency: string]: {
    readonly [toCurrency: string]: number;
  };
}

export interface CurrencyConfig {
  readonly currencies: Currency[];
  readonly exchangeRates: ExchangeRates;
  readonly defaultCurrency: string;
}

export interface ConversionResult {
  readonly amount: number;
  readonly from: string;
  readonly to: string;
  readonly converted: number;
  readonly rate: number;
}
