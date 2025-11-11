import { apiFetch } from './apiUtils';

export const Favorites = {
  list: () =>
    apiFetch('/api/v1/favorites'),

  toggle: (listingId: number) =>
    apiFetch(`/api/v1/favorites/${listingId}/toggle`, { method: 'POST' }),

  delete: (listingId: number) =>
    apiFetch(`/api/v1/favorites/${listingId}`, { method: 'DELETE' }, false),
};
