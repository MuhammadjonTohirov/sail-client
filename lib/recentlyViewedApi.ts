import { apiFetch, getClientSessionId } from './apiUtils';

export const RecentlyViewed = {
  list: () =>
    apiFetch('/api/v1/recently-viewed'),

  track: (listingId: number) =>
    apiFetch(`/api/v1/recently-viewed/${listingId}`, {
      method: 'POST',
      headers: { 'X-Client-Session-Id': getClientSessionId() },
    }),

  clear: () =>
    apiFetch('/api/v1/recently-viewed/clear', { method: 'DELETE' }),
};
