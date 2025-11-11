import { IListingsRepository } from '../../repositories/IListingsRepository';

export class RefreshListingUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid listing ID');
    }

    await this.repository.refreshListing(id);
  }
}
