import { ISuggestedListingsRepository } from '../../repositories/ISuggestedListingsRepository';
import { Listing } from '../../models/Listing';

export class GetSuggestedListingsUseCase {
  constructor(private readonly repository: ISuggestedListingsRepository) {}

  async execute(limit?: number): Promise<Listing[]> {
    return await this.repository.getSuggestedListings(limit);
  }
}
