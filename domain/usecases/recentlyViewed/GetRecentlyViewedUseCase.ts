import { IRecentlyViewedRepository } from '../../repositories/IRecentlyViewedRepository';
import { RecentlyViewedListing } from '../../models/RecentlyViewedListing';

export class GetRecentlyViewedUseCase {
  constructor(private readonly repository: IRecentlyViewedRepository) {}

  async execute(): Promise<RecentlyViewedListing[]> {
    return await this.repository.getRecentlyViewed();
  }
}
