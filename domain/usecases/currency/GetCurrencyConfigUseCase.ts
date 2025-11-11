import { ICurrencyRepository } from '../../repositories/ICurrencyRepository';
import { CurrencyConfig } from '../../models/Currency';

export class GetCurrencyConfigUseCase {
  constructor(private readonly repository: ICurrencyRepository) {}

  async execute(): Promise<CurrencyConfig> {
    return await this.repository.getConfig();
  }
}
