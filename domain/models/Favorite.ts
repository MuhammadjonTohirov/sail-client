export interface Favorite {
  readonly id: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly listingPrice: number;
  readonly listingLocation: string;
  readonly listingMediaUrls: string[];
  readonly createdAt: string;
}

export interface ToggleFavoriteResult {
  readonly favorited: boolean;
}
