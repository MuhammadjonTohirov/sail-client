export interface RecentlyViewedDTO {
  id: number;
  listing: number;
  listing_title: string;
  listing_price: number;
  listing_location: string;
  listing_media_urls: string[];
  viewed_at: string;
}
