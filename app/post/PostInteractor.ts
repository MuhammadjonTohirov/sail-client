"use client";

import { GetCategoriesUseCase } from '@/domain/usecases/taxonomy/GetCategoriesUseCase';
import { GetCategoryAttributesUseCase } from '@/domain/usecases/taxonomy/GetCategoryAttributesUseCase';
import { CreateListingUseCase } from '@/domain/usecases/listings/CreateListingUseCase';
import { UpdateListingUseCase } from '@/domain/usecases/listings/UpdateListingUseCase';
import { GetListingDetailUseCase } from '@/domain/usecases/listings/GetListingDetailUseCase';
import { UploadListingMediaUseCase } from '@/domain/usecases/listings/UploadListingMediaUseCase';
import { DeleteListingMediaUseCase } from '@/domain/usecases/listings/DeleteListingMediaUseCase';
import { GetProfileUseCase } from '@/domain/usecases/profile/GetProfileUseCase';
import { GetTelegramChatsUseCase } from '@/domain/usecases/telegram/GetTelegramChatsUseCase';
import { TaxonomyRepositoryImpl } from '@/data/repositories/TaxonomyRepositoryImpl';
import { ListingsRepositoryImpl } from '@/data/repositories/ListingsRepositoryImpl';
import { ProfileRepositoryImpl } from '@/data/repositories/ProfileRepositoryImpl';
import { TelegramRepositoryImpl } from '@/data/repositories/TelegramRepositoryImpl';
import { Category } from '@/domain/models/Category';
import { Attribute } from '@/domain/models/Attribute';
import { Listing } from '@/domain/models/Listing';
import { ListingPayload } from '@/domain/models/ListingPayload';
import { TelegramChat } from '@/domain/models/TelegramChat';

import { Listings } from '@/lib/api';
import { UserProfile } from '@/domain/models/UserProfile';
import { ShareListingUseCase } from '@/domain/usecases/listings/ShareListingUseCase';

export class PostInteractor {
  private getCategoriesUseCase: GetCategoriesUseCase;
  private getCategoryAttributesUseCase: GetCategoryAttributesUseCase;
  private createListingUseCase: CreateListingUseCase;
  private updateListingUseCase: UpdateListingUseCase;
  private getListingDetailUseCase: GetListingDetailUseCase;
  private uploadListingMediaUseCase: UploadListingMediaUseCase;
  private deleteListingMediaUseCase: DeleteListingMediaUseCase;
  private getProfileUseCase: GetProfileUseCase;
  private getTelegramChatsUseCase: GetTelegramChatsUseCase;
  private shareListingUseCase: ShareListingUseCase;

  constructor() {
    const taxonomyRepository = new TaxonomyRepositoryImpl();
    const listingsRepository = new ListingsRepositoryImpl();
    const profileRepository = new ProfileRepositoryImpl();
    const telegramRepository = new TelegramRepositoryImpl();

    this.getCategoriesUseCase = new GetCategoriesUseCase(taxonomyRepository);
    this.getCategoryAttributesUseCase = new GetCategoryAttributesUseCase(taxonomyRepository);
    this.createListingUseCase = new CreateListingUseCase(listingsRepository);
    this.updateListingUseCase = new UpdateListingUseCase(listingsRepository);
    this.getListingDetailUseCase = new GetListingDetailUseCase(listingsRepository);
    this.uploadListingMediaUseCase = new UploadListingMediaUseCase(listingsRepository);
    this.deleteListingMediaUseCase = new DeleteListingMediaUseCase(listingsRepository);
    this.getProfileUseCase = new GetProfileUseCase(profileRepository);
    this.getTelegramChatsUseCase = new GetTelegramChatsUseCase(telegramRepository);
    this.shareListingUseCase = new ShareListingUseCase(listingsRepository);
  }

  async fetchCategoryTree(): Promise<Category[]> {
    return await this.getCategoriesUseCase.execute();
  }

  async fetchCategoryAttributes(categoryId: number): Promise<Attribute[]> {
    return await this.getCategoryAttributesUseCase.execute(categoryId);
  }

  async fetchUserProfile(): Promise<UserProfile | null> {
    try {
      return await this.getProfileUseCase.execute();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  async fetchTelegramChats(): Promise<TelegramChat[]> {
    try {
      return await this.getTelegramChatsUseCase.execute();
    } catch (error) {
      console.error('Failed to fetch telegram chats:', error);
      return [];
    }
  }

  async fetchListingDetail(listingId: number): Promise<Listing> {
    return await this.getListingDetailUseCase.execute(listingId);
  }

  async createListing(payload: ListingPayload): Promise<Listing> {
    return await this.createListingUseCase.execute(payload);
  }

  async updateListing(listingId: number, payload: ListingPayload): Promise<Listing> {
    return await this.updateListingUseCase.execute(listingId, payload);
  }

  async uploadMedia(listingId: number, file: File): Promise<void> {
    return await this.uploadListingMediaUseCase.execute(listingId, file);
  }

  async deleteMedia(listingId: number, mediaId: number): Promise<void> {
    return await this.deleteListingMediaUseCase.execute(listingId, mediaId);
  }

  async reorderMedia(listingId: number, mediaIds: number[]): Promise<void> {
    // This doesn't have a use case yet, so we'll call the API directly
    return await Listings.reorderMedia(listingId, mediaIds);
  }

  async shareListing(listingId: number, chatIds: number[]): Promise<void> {
    return await this.shareListingUseCase.execute(listingId, chatIds);
  }
}
