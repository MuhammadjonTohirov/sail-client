import { IListingsRepository } from '../../repositories/IListingsRepository';

export class ActivateListingUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.activateListing(id);
  }
}
