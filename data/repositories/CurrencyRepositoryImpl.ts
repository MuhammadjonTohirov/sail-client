import { ICurrencyRepository } from '../../domain/repositories/ICurrencyRepository';
import { CurrencyConfig, ConversionResult } from '../../domain/models/Currency';
import { CurrencyApi } from '../../lib/currencyApi';
import { CurrencyMapper } from '../mappers/CurrencyMapper';
import { CurrencyConfigDTO, ConversionResultDTO } from '../models/CurrencyDTO';

export class CurrencyRepositoryImpl implements ICurrencyRepository {
  async getConfig(): Promise<CurrencyConfig> {
    const dto = await CurrencyApi.getConfig() as CurrencyConfigDTO;
    return CurrencyMapper.toConfig(dto);
  }

  async convert(amount: number, from: string, to: string): Promise<ConversionResult> {
    const dto = await CurrencyApi.convert(amount, from, to) as ConversionResultDTO;
    return CurrencyMapper.toConversionResult(dto);
  }
}
