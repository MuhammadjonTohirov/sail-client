import { RecentlyViewedListing } from '../models/RecentlyViewedListing';

export interface IRecentlyViewedRepository {
  getRecentlyViewed(): Promise<RecentlyViewedListing[]>;
  trackListing(listingId: number): Promise<void>;
  clearAll(): Promise<void>;
}
