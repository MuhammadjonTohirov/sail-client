import { apiFetch } from './apiUtils';

export type ListingPayload = {
  title: string;
  description?: string;
  price_amount: string | number;
  price_currency: string;
  is_price_negotiable?: boolean;
  condition: string;
  deal_type?: 'sell' | 'exchange' | 'free';
  seller_type?: 'person' | 'business';
  category: number;
  location: number;
  lat?: number;
  lon?: number;
  attributes?: { attribute: number; value: unknown }[];
};

export const Listings = {
  create: (payload: ListingPayload) =>
    apiFetch('/api/v1/listings/raw', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  detail: (id: number) =>
    apiFetch(`/api/v1/listings/${id}`),

  mine: () =>
    apiFetch('/api/v1/my/listings'),

  update: (id: number, payload: Partial<ListingPayload>) =>
    apiFetch(`/api/v1/listings/${id}/edit/raw`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  refresh: (id: number) =>
    apiFetch(`/api/v1/listings/${id}/refresh`, { method: 'POST' }),

  uploadMedia: async (id: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiFetch(`/api/v1/listings/${id}/media`, {
      method: 'POST',
      body: form
    }, false);
    return res.json();
  },

  deleteMedia: (listingId: number, mediaId: number) =>
    apiFetch(`/api/v1/listings/${listingId}/media/${mediaId}`, {
      method: 'DELETE'
    }),

  reorderMedia: (listingId: number, mediaIds: number[]) =>
    apiFetch(`/api/v1/listings/${listingId}/media/reorder`, {
      method: 'POST',
      body: JSON.stringify({ media_ids: mediaIds })
    }),
};
