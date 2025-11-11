import { IRecentlyViewedRepository } from '../../repositories/IRecentlyViewedRepository';

export class ClearRecentlyViewedUseCase {
  constructor(private readonly repository: IRecentlyViewedRepository) {}

  async execute(): Promise<void> {
    await this.repository.clearAll();
  }
}
