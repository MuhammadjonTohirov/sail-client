import { apiFetch } from './apiUtils';

export const SuggestedListings = {
  list: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiFetch(`/api/v1/suggested-listings${params}`);
  },
};
