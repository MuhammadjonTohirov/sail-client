import { apiFetch, currentLocale } from './apiUtils';

export interface ReverseGeocodeResult {
  id: number;
  name: string;
  name_ru?: string;
  name_uz?: string;
  kind: string;
  path: string;
  distance: number;
}

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

  reverseGeocode: async (lat: number, lon: number): Promise<ReverseGeocodeResult | null> => {
    try {
      const qp = new URLSearchParams();
      qp.set('lat', String(lat));
      qp.set('lon', String(lon));
      qp.set('lang', currentLocale());
      const result = await apiFetch(`/api/v1/locations/reverse-geocode?${qp.toString()}`);
      return result as ReverseGeocodeResult;
    } catch (e) {
      console.error('Reverse geocode failed:', e);
      return null;
    }
  },
};
