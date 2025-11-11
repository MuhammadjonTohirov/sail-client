import { ILocaleRepository } from '../../repositories/ILocaleRepository';

export class GetCurrentLocaleUseCase {
  constructor(private readonly repository: ILocaleRepository) {}

  execute(): string {
    return this.repository.getCurrentLocale();
  }
}
