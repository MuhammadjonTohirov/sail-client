import { Listing, ListingMedia, RevealContactResult } from '../models/Listing';
import { ListingPayload } from '../models/ListingPayload';
import { SearchListing } from '../models/SearchListing';
import { UserListingsParams } from '../models/UserListingsParams';

export interface IListingsRepository {
  createListing(payload: ListingPayload): Promise<Listing>;
  getListingDetail(id: number): Promise<Listing>;
  getMyListings(): Promise<Listing[]>;
  getUserListings(params: UserListingsParams): Promise<SearchListing[]>;
  updateListing(id: number, payload: Partial<ListingPayload>): Promise<Listing>;
  refreshListing(id: number): Promise<void>;
  uploadMedia(id: number, file: File): Promise<ListingMedia>;
  deleteMedia(listingId: number, mediaId: number): Promise<void>;
  shareListing(id: number, chatIds: number[]): Promise<void>;
  activateListing(id: number): Promise<void>;
  deactivateListing(id: number): Promise<void>;
  deleteListing(id: number): Promise<void>;
  reorderMedia(listingId: number, mediaIds: number[]): Promise<void>;
  trackInterest(id: number): Promise<void>;
  revealContact(id: number): Promise<RevealContactResult>;
}
