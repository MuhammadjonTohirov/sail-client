import { appConfig } from '@/config';
import { apiFetch, absolutizeUrl } from './apiUtils';

export const Search = {
  listings: async (params: Record<string, any>) => {
    const usp = new URLSearchParams();
    const requestParams = { per_page: appConfig.pagination.itemsPerPage, ...params };
    Object.entries(requestParams).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach((item) => usp.append(k, String(item)));
      } else {
        usp.set(k, String(v));
      }
    });
    const data = await apiFetch(`/api/v1/search/listings?${usp.toString()}`);

    if (data && Array.isArray(data.results)) {
      data.results = data.results.map((r: any) => ({
        ...r,
        media_urls: Array.isArray(r.media_urls)
          ? r.media_urls.map((m: string) => absolutizeUrl(m))
          : r.media_urls,
      }));
    }
    return data;
  },
};
