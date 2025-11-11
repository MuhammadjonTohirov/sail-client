export interface ListingMedia {
  readonly id: number;
  readonly type?: string | null;
  readonly image?: string | null;
  readonly imageUrl?: string | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly order?: number | null;
  readonly uploadedAt?: string | null;
}

export interface ListingSeller {
  readonly id: number;
  readonly name?: string;
  readonly avatarUrl?: string;
  readonly since?: string | null;
  readonly logo?: string | null;
  readonly banner?: string | null;
  readonly phone?: string;
  readonly lastActiveAt?: string | null;
}

export interface ListingUser {
  readonly id: number;
  readonly phone?: string;
  readonly name?: string;
  readonly displayName?: string;
  readonly phoneE164?: string;
}

export interface Listing {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly priceAmount: number;
  readonly priceCurrency: string;
  readonly isPriceNegotiable?: boolean;
  readonly condition: string;
  readonly dealType?: 'sell' | 'exchange' | 'free';
  readonly sellerType?: 'person' | 'business';
  readonly categoryId: number;
  readonly categoryName?: string;
  readonly categorySlug?: string;
  readonly locationId: number;
  readonly locationName?: string;
  readonly locationSlug?: string;
  readonly lat?: number;
  readonly lon?: number;
  readonly media?: ListingMedia[];
  readonly mediaUrls?: string[];
  readonly attributes?: Array<{ key: string; value: unknown; label?: string }>;
  readonly status?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly refreshedAt?: string;
  readonly expiresAt?: string;
  readonly qualityScore?: number | null;
  readonly contactPhoneMasked?: string | null;
  readonly priceNormalized?: number | null;
  readonly isPromoted?: boolean | null;
  readonly userId?: number;
  readonly user?: ListingUser;
  readonly seller?: ListingSeller;
}
