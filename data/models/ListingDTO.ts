export interface ListingMediaDTO {
  id: number;
  type?: string | null;
  image?: string | null;
  image_url?: string | null;
  width?: number | null;
  height?: number | null;
  order?: number | null;
  uploaded_at?: string | null;
}

export interface ListingSellerDTO {
  id: number;
  name?: string;
  avatar_url?: string;
  since?: string | null;
  logo?: string | null;
  banner?: string | null;
  phone?: string;
  last_active_at?: string | null;
}

export interface ListingUserDTO {
  id: number;
  phone?: string;
  name?: string;
  display_name?: string;
  phone_e164?: string;
}

export interface ListingDTO {
  id: number;
  title: string;
  description?: string;
  price_amount: number;
  price_currency: string;
  is_price_negotiable?: boolean;
  condition: string;
  deal_type?: 'sell' | 'exchange' | 'free';
  seller_type?: 'person' | 'business';
  category?: number;
  category_name?: string;
  category_slug?: string;
  location?: number;
  location_name?: string;
  location_slug?: string;
  lat?: number;
  lon?: number;
  media?: ListingMediaDTO[];
  media_urls?: string[];
  attributes?: Array<{ key: string; value: unknown; label?: string }>;
  status?: string;
  created_at?: string;
  updated_at?: string;
  refreshed_at?: string;
  expires_at?: string;
  quality_score?: number | null;
  contact_phone_masked?: string | null;
  price_normalized?: number | null;
  is_promoted?: boolean | null;
  user_id?: number;
  user?: ListingUserDTO;
  seller?: ListingSellerDTO;
}

export interface ListingPayloadDTO {
  title: string;
  description?: string;
  price_amount: string | number;
  price_currency: string;
  is_price_negotiable?: boolean;
  condition: string;
  deal_type?: 'sell' | 'exchange' | 'free';
  seller_type?: 'person' | 'business';
  category: number;
  location: number;
  lat?: number;
  lon?: number;
  attributes?: Array<{ attribute: number; value: unknown }>;
}
