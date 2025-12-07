import { ISuggestedListingsRepository } from '../../domain/repositories/ISuggestedListingsRepository';
import { Listing } from '../../domain/models/Listing';
import { ListingMapper } from '../mappers/ListingMapper';
import { SuggestedListings } from '../../lib/suggestedListingsApi';
import { ListingDTO } from '../models/ListingDTO';

export class SuggestedListingsRepositoryImpl implements ISuggestedListingsRepository {
  async getSuggestedListings(limit?: number): Promise<Listing[]> {
    const response: any = await SuggestedListings.list(limit);
    const dtos: ListingDTO[] = response.results || [];
    return dtos.map((dto) => ListingMapper.toDomain(dto));
  }
}
