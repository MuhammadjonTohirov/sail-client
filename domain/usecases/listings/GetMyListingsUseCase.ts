import { IListingsRepository } from '../../repositories/IListingsRepository';
import { Listing } from '../../models/Listing';

export class GetMyListingsUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(): Promise<Listing[]> {
    return await this.repository.getMyListings();
  }
}
