import { Currency, CurrencyConfig, ConversionResult, ExchangeRates } from '../../domain/models/Currency';
import { CurrencyDTO, CurrencyConfigDTO, ConversionResultDTO, ExchangeRatesDTO } from '../models/CurrencyDTO';

export class CurrencyMapper {
  static toCurrency(dto: CurrencyDTO): Currency {
    return {
      code: dto.code,
      name: dto.name,
      symbol: dto.symbol,
      isDefault: dto.is_default,
    };
  }

  static toExchangeRates(dto: ExchangeRatesDTO): ExchangeRates {
    return dto;
  }

  static toConfig(dto: CurrencyConfigDTO): CurrencyConfig {
    return {
      currencies: dto.currencies.map(c => this.toCurrency(c)),
      exchangeRates: this.toExchangeRates(dto.exchange_rates),
      defaultCurrency: dto.default_currency,
    };
  }

  static toConversionResult(dto: ConversionResultDTO): ConversionResult {
    return {
      amount: dto.amount,
      from: dto.from,
      to: dto.to,
      converted: dto.converted,
      rate: dto.rate,
    };
  }
}
