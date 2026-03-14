import { IListingsRepository } from '../../domain/repositories/IListingsRepository';
import { Listing, ListingMedia, RevealContactResult } from '../../domain/models/Listing';
import { ListingPayload } from '../../domain/models/ListingPayload';
import { UserListingsParams } from '../../domain/models/UserListingsParams';
import { ListingMapper } from '../mappers/ListingMapper';
import { Listings } from '../../lib/listingsApi';
import { Search } from '../../lib/searchApi';
import { SearchListing } from '@/domain/models/SearchListing';
import { SearchMapper } from '../mappers/SearchMapper';

export class ListingsRepositoryImpl implements IListingsRepository {
  async createListing(payload: ListingPayload): Promise<Listing> {
    const dto = ListingMapper.payloadToDTO(payload);
    const result = await Listings.create(dto);
    return ListingMapper.toDomain(result);
  }

  async getListingDetail(id: number): Promise<Listing> {
    const result = await Listings.detail(id);
    return ListingMapper.toDomain(result);
  }

  async getMyListings(): Promise<Listing[]> {
    const result = await Listings.mine();
    return ListingMapper.toDomainList(result);
  }

  async getUserListings(params: UserListingsParams): Promise<SearchListing[]> {
    const searchParams: Record<string, string | number> = {
      user_id: params.userId,
      sort: params.sort || 'newest',
    };

    if (params.category) {
      searchParams.category_slug = params.category;
    }

    const response = await Search.listings(searchParams);
    const results = response.results || [];
    return SearchMapper.searchListingToDomainList(results);
  }

  async updateListing(id: number, payload: Partial<ListingPayload>): Promise<Listing> {
    const dto = ListingMapper.partialPayloadToDTO(payload);
    const result = await Listings.update(id, dto);
    return ListingMapper.toDomain(result);
  }

  async refreshListing(id: number): Promise<void> {
    await Listings.refresh(id);
  }

  async uploadMedia(id: number, file: File): Promise<ListingMedia> {
    const dto = await Listings.uploadMedia(id, file);
    return {
      id: dto.id,
      type: dto.type ?? null,
      image: dto.image ?? null,
      imageUrl: dto.image_url ?? null,
      width: dto.width ?? null,
      height: dto.height ?? null,
      order: dto.order ?? null,
      uploadedAt: dto.uploaded_at ?? null,
    };
  }

  async deleteMedia(listingId: number, mediaId: number): Promise<void> {
    await Listings.deleteMedia(listingId, mediaId);
  }

  async shareListing(id: number, chatIds: number[]): Promise<void> {
    await Listings.share(id, chatIds);
  }

  async activateListing(id: number): Promise<void> {
    await Listings.activate(id);
  }

  async deactivateListing(id: number): Promise<void> {
    await Listings.deactivate(id);
  }

  async deleteListing(id: number): Promise<void> {
    await Listings.delete(id);
  }

  async reorderMedia(listingId: number, mediaIds: number[]): Promise<void> {
    await Listings.reorderMedia(listingId, mediaIds);
  }

  async trackInterest(id: number): Promise<void> {
    await Listings.trackInterest(id);
  }

  async revealContact(id: number): Promise<RevealContactResult> {
    const dto = await Listings.revealContact(id);
    return {
      contactName: dto.contact_name,
      contactPhone: dto.contact_phone,
      contactEmail: dto.contact_email,
      tracked: dto.tracked,
    };
  }
}
