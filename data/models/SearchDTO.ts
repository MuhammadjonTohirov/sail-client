import { ListingSellerDTO } from "./ListingDTO";

export interface SearchListingDTO {
  id: string;
  title: string;
  price?: number;
  description?: string | null;
  condition?: string | null;
  quality_score?: number | null;
  score?: number | null;
  currency?: string;
  media_urls?: string[];
  location_name_ru?: string;
  location_name_uz?: string;
  refreshed_at?: string;
  is_promoted?: boolean;
  seller?: ListingSellerDTO | null;
}


export interface SearchFacetOptionDTO {
  key: string | null;
  count: number | null;
}

export interface SearchPriceRangeFacetDTO {
  min: number | null;
  max: number | null;
  currency: string | null;
}

export interface SearchFacetsDTO {
  categories?: SearchFacetOptionDTO[] | null;
  locations?: SearchFacetOptionDTO[] | null;
  conditions?: SearchFacetOptionDTO[] | null;
  price_range?: SearchPriceRangeFacetDTO | null;
  attributes?: Record<string, SearchFacetOptionDTO[] | null> | null;
}

export interface SearchResultDTO {
  results?: SearchListingDTO[] | null;
  total?: number | null;
  page?: number | null;
  per_page?: number | null;
  facets?: SearchFacetsDTO | null;
}
