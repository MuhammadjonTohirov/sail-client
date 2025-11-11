export interface CurrencyDTO {
  code: string;
  name: string;
  symbol: string;
  is_default: boolean;
}

export interface ExchangeRatesDTO {
  [fromCurrency: string]: {
    [toCurrency: string]: number;
  };
}

export interface CurrencyConfigDTO {
  currencies: CurrencyDTO[];
  exchange_rates: ExchangeRatesDTO;
  default_currency: string;
}

export interface ConversionResultDTO {
  amount: number;
  from: string;
  to: string;
  converted: number;
  rate: number;
}
