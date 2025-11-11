import { apiFetch, currentLocale, type SupportedLocale } from './apiUtils';

export const Moderation = {
  reasons: (lang?: SupportedLocale) => {
    const locale = lang || currentLocale();
    return apiFetch(`/api/v1/reports/reasons?lang=${locale}`);
  },

  submitReport: (payload: { listing: number; reason_code: string; notes?: string }) =>
    apiFetch('/api/v1/reports', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
};
