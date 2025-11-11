import { SearchListing } from './SearchListing';

export interface SearchFacetOption {
  readonly key: string | null;
  readonly count: number | null;
}

export interface SearchPriceRangeFacet {
  readonly min: number | null;
  readonly max: number | null;
  readonly currency: string | null;
}

export interface SearchFacets {
  categories?: SearchFacetOption[] | null;
  locations?: SearchFacetOption[] | null;
  conditions?: SearchFacetOption[] | null;
  price_range?: SearchPriceRangeFacet | null;
  attributes?: Record<string, SearchFacetOption[] | null> | null;
}

export interface SearchResult {
  readonly results?: SearchListing[] | null;
  readonly total?: number | null;
  readonly page?: number | null;
  readonly perPage?: number | null;
  readonly facets?: SearchFacets | null;

  // static empty object for SearchResult
  
  readonly empty: SearchResult;
}
