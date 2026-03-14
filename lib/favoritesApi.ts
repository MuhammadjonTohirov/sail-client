import { apiFetch } from './apiUtils';
import type { FavoriteDTO, ToggleFavoriteResultDTO } from '@/data/models/FavoriteDTO';

export const Favorites = {
  list: async (): Promise<FavoriteDTO[]> => {
    const data = await apiFetch('/api/v1/favorites');
    return data?.results ?? [];
  },

  toggle: (listingId: number): Promise<ToggleFavoriteResultDTO> =>
    apiFetch(`/api/v1/favorites/${listingId}/toggle`, { method: 'POST' }),

  delete: (listingId: number): Promise<Response> =>
    apiFetch(`/api/v1/favorites/${listingId}`, { method: 'DELETE' }, false),
};
