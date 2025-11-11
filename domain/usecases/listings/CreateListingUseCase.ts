import { IListingsRepository } from '../../repositories/IListingsRepository';
import { ListingPayload } from '../../models/ListingPayload';
import { Listing } from '../../models/Listing';

export class CreateListingUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(payload: ListingPayload): Promise<Listing> {
    if (!payload.title || payload.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    const priceNum = typeof payload.priceAmount === 'string' ? parseFloat(payload.priceAmount) : payload.priceAmount;
    if (!priceNum || priceNum <= 0) {
      throw new Error('Valid price is required');
    }
    if (!payload.categoryId) {
      throw new Error('Category is required');
    }
    if (!payload.locationId) {
      throw new Error('Location is required');
    }

    return await this.repository.createListing(payload);
  }
}
