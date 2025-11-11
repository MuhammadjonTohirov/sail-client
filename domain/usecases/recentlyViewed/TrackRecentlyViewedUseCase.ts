import { IRecentlyViewedRepository } from '../../repositories/IRecentlyViewedRepository';

export class TrackRecentlyViewedUseCase {
  constructor(private readonly repository: IRecentlyViewedRepository) {}

  async execute(listingId: number): Promise<void> {
    if (!listingId || listingId <= 0) {
      throw new Error('Invalid listing ID');
    }

    await this.repository.trackListing(listingId);
  }
}
