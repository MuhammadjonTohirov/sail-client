import { ISuggestedListingsRepository } from '../../domain/repositories/ISuggestedListingsRepository';
import { Listing } from '../../domain/models/Listing';
import { ListingMapper } from '../mappers/ListingMapper';
import { SuggestedListings } from '../../lib/suggestedListingsApi';

export class SuggestedListingsRepositoryImpl implements ISuggestedListingsRepository {
  async getSuggestedListings(limit?: number): Promise<Listing[]> {
    const response = await SuggestedListings.list(limit);
    const dtos = response.results || [];
    return dtos.map(dto => ListingMapper.toDomain(dto));
  }
}
