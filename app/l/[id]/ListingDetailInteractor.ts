"use client";

import { GetListingDetailUseCase } from '@/domain/usecases/listings/GetListingDetailUseCase';
import { GetUserListingsUseCase } from '@/domain/usecases/listings/GetUserListingsUseCase';
import { ListThreadsUseCase } from '@/domain/usecases/chat/ListThreadsUseCase';
import { GeocodeLocationUseCase } from '@/domain/usecases/geocoding/GeocodeLocationUseCase';
import { ListingsRepositoryImpl } from '@/data/repositories/ListingsRepositoryImpl';
import { ChatRepositoryImpl } from '@/data/repositories/ChatRepositoryImpl';
import { GeocodingRepositoryImpl } from '@/data/repositories/GeocodingRepositoryImpl';
import { Listing } from '@/domain/models/Listing';
import { ChatThread } from '@/domain/models/chat/ChatThread';
import { GeoLocation } from '@/domain/models/GeoLocation';
import { SearchListing } from '@/domain/models/SearchListing';

export class ListingDetailInteractor {
  private getListingDetailUseCase: GetListingDetailUseCase;
  private getUserListingsUseCase: GetUserListingsUseCase;
  private listThreadsUseCase: ListThreadsUseCase;
  private geocodeLocationUseCase: GeocodeLocationUseCase;

  constructor() {
    const listingsRepository = new ListingsRepositoryImpl();
    const chatRepository = new ChatRepositoryImpl();
    const geocodingRepository = new GeocodingRepositoryImpl();

    this.getListingDetailUseCase = new GetListingDetailUseCase(listingsRepository);
    this.getUserListingsUseCase = new GetUserListingsUseCase(listingsRepository);
    this.listThreadsUseCase = new ListThreadsUseCase(chatRepository);
    this.geocodeLocationUseCase = new GeocodeLocationUseCase(geocodingRepository);
  }

  async fetchListingDetail(id: number): Promise<Listing> {
    return await this.getListingDetailUseCase.execute(id);
  }

  async fetchSellerListings(userId: number, excludeId: number): Promise<SearchListing[]> {
    const results = await this.getUserListingsUseCase.execute({ userId, sort: 'newest' });
    return results.filter((l) => Number(l.id) !== excludeId).slice(0, 6);
  }

  async findChatThread(listingId: number): Promise<ChatThread | null> {
    const threads = await this.listThreadsUseCase.execute();
    return threads.find((t) => t.listing.listingId === listingId) || null;
  }

  async geocodeLocation(locationName: string): Promise<GeoLocation | null> {
    return await this.geocodeLocationUseCase.execute(locationName);
  }
}
