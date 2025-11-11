import { apiFetch } from './apiUtils';

export const RecentlyViewed = {
  list: () =>
    apiFetch('/api/v1/recently-viewed'),

  track: (listingId: number) =>
    apiFetch(`/api/v1/recently-viewed/${listingId}`, { method: 'POST' }),

  clear: () =>
    apiFetch('/api/v1/recently-viewed/clear', { method: 'DELETE' }),
};
