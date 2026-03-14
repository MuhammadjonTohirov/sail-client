import { apiFetch } from './apiUtils';
import type { CurrencyConfigDTO, ConversionResultDTO } from '@/data/models/CurrencyDTO';

export const CurrencyApi = {
  getConfig: (): Promise<CurrencyConfigDTO> =>
    apiFetch('/api/v1/currency/config'),

  convert: (amount: number, from: string, to: string): Promise<ConversionResultDTO> =>
    apiFetch(`/api/v1/currency/convert?amount=${amount}&from=${from}&to=${to}`),
};
