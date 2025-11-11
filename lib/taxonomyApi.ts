import { apiFetch, currentLocale } from './apiUtils';

export const Taxonomy = {
  categories: () =>
    apiFetch(`/api/v1/categories?lang=${currentLocale()}`),

  attributes: (id: number) =>
    apiFetch(`/api/v1/categories/${id}/attributes?lang=${currentLocale()}`),

  locations: (parent_id?: number) => {
    const qp = new URLSearchParams();
    qp.set('lang', currentLocale());
    if (parent_id !== undefined) qp.set('parent_id', String(parent_id));
    return apiFetch(`/api/v1/locations?${qp.toString()}`);
  },
};
