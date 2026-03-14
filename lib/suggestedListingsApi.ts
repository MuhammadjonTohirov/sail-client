import { apiFetch } from './apiUtils';
import type { ListingDTO } from '@/data/models/ListingDTO';

interface SuggestedListingsResponse {
  results: ListingDTO[];
}

export const SuggestedListings = {
  list: (limit?: number): Promise<SuggestedListingsResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    return apiFetch(`/api/v1/suggested-listings${params}`);
  },
};
