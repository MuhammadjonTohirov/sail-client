export interface RecentlyViewedListing {
  readonly id: number;
  readonly listingId: number;
  readonly title: string;
  readonly price: number;
  readonly location: string;
  readonly mediaUrls: string[];
  readonly viewedAt: Date;
}
