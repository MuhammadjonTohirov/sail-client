import { IListingsRepository } from '../../domain/repositories/IListingsRepository';
import { Listing } from '../../domain/models/Listing';
import { ListingPayload } from '../../domain/models/ListingPayload';
import { UserListingsParams } from '../../domain/models/UserListingsParams';
import { ListingDTO } from '../models/ListingDTO';
import { ListingMapper } from '../mappers/ListingMapper';
import { Listings } from '../../lib/listingsApi';
import { Search } from '../../lib/searchApi';
import { SearchListing } from '@/domain/models/SearchListing';
import { SearchListingDTO } from '../models/SearchDTO';
import { SearchMapper } from '../mappers/SearchMapper';

export class ListingsRepositoryImpl implements IListingsRepository {
  async createListing(payload: ListingPayload): Promise<Listing> {
    const dto = ListingMapper.payloadToDTO(payload);
    const result: ListingDTO = await Listings.create(dto as any);
    return ListingMapper.toDomain(result);
  }

  async getListingDetail(id: number): Promise<Listing> {
    const result: ListingDTO = await Listings.detail(id);
    return ListingMapper.toDomain(result);
  }

  async getMyListings(): Promise<Listing[]> {
    const result: ListingDTO[] = await Listings.mine();
    return ListingMapper.toDomainList(result);
  }

  async getUserListings(params: UserListingsParams): Promise<SearchListing[]> {
    const searchParams: Record<string, any> = {
      user_id: params.userId,
      sort: params.sort || 'newest',
    };

    if (params.category) {
      searchParams.category_slug = params.category;
    }

    const response = await Search.listings(searchParams);
    const results: SearchListingDTO[] = response.results || [];

    return SearchMapper.searchListingToDomainList(results);
  }

  async updateListing(id: number, payload: Partial<ListingPayload>): Promise<Listing> {
    const dto = ListingMapper.partialPayloadToDTO(payload);
    const result: ListingDTO = await Listings.update(id, dto as any);
    return ListingMapper.toDomain(result);
  }

  async refreshListing(id: number): Promise<void> {
    await Listings.refresh(id);
  }

  async uploadMedia(id: number, file: File): Promise<any> {
    return await Listings.uploadMedia(id, file);
  }

  async deleteMedia(listingId: number, mediaId: number): Promise<void> {
    await Listings.deleteMedia(listingId, mediaId);
  }
}
