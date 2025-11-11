import { IListingsRepository } from '../../repositories/IListingsRepository';
import { ListingPayload } from '../../models/ListingPayload';
import { Listing } from '../../models/Listing';

export class UpdateListingUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number, payload: Partial<ListingPayload>): Promise<Listing> {
    if (!id || id <= 0) {
      throw new Error('Invalid listing ID');
    }

    return await this.repository.updateListing(id, payload);
  }
}
