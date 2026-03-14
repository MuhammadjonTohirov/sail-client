import { apiFetch, currentLocale, type SupportedLocale } from './apiUtils';
import type { ReportReasonDTO, ReportPayloadDTO } from '@/data/models/ModerationDTO';

export const Moderation = {
  reasons: (lang?: SupportedLocale): Promise<ReportReasonDTO[]> => {
    const locale = lang || currentLocale();
    return apiFetch(`/api/v1/reports/reasons?lang=${locale}`);
  },

  submitReport: (payload: ReportPayloadDTO): Promise<void> =>
    apiFetch('/api/v1/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
