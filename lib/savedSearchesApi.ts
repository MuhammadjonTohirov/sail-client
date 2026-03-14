import { apiFetch } from './apiUtils';
import type { SavedSearchDTO, SavedSearchPayloadDTO, SavedSearchUpdatePayloadDTO } from '@/data/models/SavedSearchDTO';

interface SavedSearchListResponse {
  results: SavedSearchDTO[];
  count?: number;
}

export const SavedSearches = {
  list: (): Promise<SavedSearchListResponse> =>
    apiFetch('/api/v1/saved-searches'),

  create: (payload: SavedSearchPayloadDTO): Promise<SavedSearchDTO> =>
    apiFetch('/api/v1/saved-searches', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  delete: (id: number): Promise<void> =>
    apiFetch(`/api/v1/saved-searches/${id}`, { method: 'DELETE' }),

  update: (id: number, payload: SavedSearchUpdatePayloadDTO): Promise<SavedSearchDTO> =>
    apiFetch(`/api/v1/saved-searches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  markViewed: (id: number): Promise<void> =>
    apiFetch(`/api/v1/saved-searches/${id}/mark-viewed`, {
      method: 'POST',
    }),
};
