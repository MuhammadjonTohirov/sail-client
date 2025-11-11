export interface FavoriteDTO {
  id: number;
  listing: number;
  listing_title: string;
  listing_price: number;
  listing_location: string;
  listing_media_urls: string[];
  created_at: string;
}

export interface ToggleFavoriteResultDTO {
  favorited: boolean;
}
