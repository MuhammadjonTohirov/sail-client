import { apiFetch } from './apiUtils';

export const SavedSearches = {
  list: () =>
    apiFetch('/api/v1/saved-searches'),

  create: (payload: { title: string; query: Record<string, any>; frequency?: 'instant' | 'daily' }) =>
    apiFetch('/api/v1/saved-searches', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  delete: (id: number) =>
    apiFetch(`/api/v1/saved-searches/${id}`, { method: 'DELETE' }),

  update: (
    id: number,
    payload: Partial<{
      title: string;
      query: Record<string, any>;
      frequency: 'instant' | 'daily';
      is_active: boolean;
    }>
  ) =>
    apiFetch(`/api/v1/saved-searches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
};
