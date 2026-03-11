import { IListingsRepository } from '../../repositories/IListingsRepository';

export class DeactivateListingUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.deactivateListing(id);
  }
}
