import { apiFetch } from './apiUtils';
import type { ListingDTO, ListingMediaDTO, ListingPayloadDTO, RevealContactResultDTO } from '@/data/models/ListingDTO';

export const Listings = {
  create: (payload: ListingPayloadDTO): Promise<ListingDTO> =>
    apiFetch('/api/v1/listings/raw', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  detail: (id: number): Promise<ListingDTO> =>
    apiFetch(`/api/v1/listings/${id}`),

  mine: async (): Promise<ListingDTO[]> => {
    const data = await apiFetch('/api/v1/my/listings');
    return data?.results ?? [];
  },

  update: (id: number, payload: Partial<ListingPayloadDTO>): Promise<ListingDTO> =>
    apiFetch(`/api/v1/listings/${id}/edit/raw`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  refresh: (id: number): Promise<void> =>
    apiFetch(`/api/v1/listings/${id}/refresh`, { method: 'POST' }),

  uploadMedia: async (id: number, file: File): Promise<ListingMediaDTO> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiFetch(`/api/v1/listings/${id}/media`, {
      method: 'POST',
      body: form,
    }, false);
    const json = await res.json();
    return (json && 'success' in json && 'data' in json) ? json.data : json;
  },

  deleteMedia: (listingId: number, mediaId: number): Promise<void> =>
    apiFetch(`/api/v1/listings/${listingId}/media/${mediaId}`, {
      method: 'DELETE',
    }),

  reorderMedia: (listingId: number, mediaIds: number[]): Promise<void> =>
    apiFetch(`/api/v1/listings/${listingId}/media/reorder`, {
      method: 'POST',
      body: JSON.stringify({ media_ids: mediaIds }),
    }),

  deactivate: (id: number): Promise<void> =>
    apiFetch(`/api/v1/listings/${id}/deactivate`, { method: 'POST' }),

  activate: (id: number): Promise<void> =>
    apiFetch(`/api/v1/listings/${id}/activate`, { method: 'POST' }),

  delete: (id: number): Promise<void> =>
    apiFetch(`/api/v1/listings/${id}/delete`, { method: 'DELETE' }),

  share: (id: number, chatIds: number[]): Promise<void> =>
    apiFetch(`/api/v1/listings/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ telegram_chat_ids: chatIds }),
    }),

  trackInterest: (id: number): Promise<void> =>
    apiFetch(`/api/v1/listings/${id}/interest`, { method: 'POST' }),

  revealContact: (id: number): Promise<RevealContactResultDTO> =>
    apiFetch(`/api/v1/listings/${id}/reveal-contact`, { method: 'POST' }),
};
