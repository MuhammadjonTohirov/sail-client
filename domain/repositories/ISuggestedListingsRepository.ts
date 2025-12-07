import { Listing } from '../models/Listing';

export interface ISuggestedListingsRepository {
  getSuggestedListings(limit?: number): Promise<Listing[]>;
}
