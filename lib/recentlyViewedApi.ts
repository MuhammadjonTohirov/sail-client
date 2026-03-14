import { apiFetch, getClientSessionId } from './apiUtils';
import type { RecentlyViewedDTO } from '@/data/models/RecentlyViewedDTO';

export const RecentlyViewed = {
  list: async (): Promise<RecentlyViewedDTO[]> => {
    const data = await apiFetch('/api/v1/recently-viewed');
    return data?.results ?? [];
  },

  track: (listingId: number): Promise<void> =>
    apiFetch(`/api/v1/recently-viewed/${listingId}`, {
      method: 'POST',
      headers: { 'X-Client-Session-Id': getClientSessionId() },
    }),

  clear: (): Promise<void> =>
    apiFetch('/api/v1/recently-viewed/clear', { method: 'DELETE' }),
};
