import { ICurrencyRepository } from '../../repositories/ICurrencyRepository';
import { ConversionResult } from '../../models/Currency';

export class ConvertCurrencyUseCase {
  constructor(private readonly repository: ICurrencyRepository) {}

  async execute(amount: number, from: string, to: string): Promise<ConversionResult> {
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!from || !to) {
      throw new Error('From and To currencies are required');
    }
    if (from.length !== 3 || to.length !== 3) {
      throw new Error('Currency codes must be 3 characters');
    }

    return await this.repository.convert(amount, from, to);
  }
}
