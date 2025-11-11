import { appConfig } from '@/config';

export const API_BASE = (appConfig.api.baseUrl || '').replace(/\/$/, '');
export const API_TIMEOUT = appConfig.api.timeout;
const SUPPORTED_LOCALES = new Set(appConfig.i18n.locales);
export type SupportedLocale = typeof appConfig.i18n.locales[number];

export function currentLocale(): SupportedLocale {
  if (typeof window === 'undefined') return appConfig.i18n.defaultLocale as SupportedLocale;
  const stored = window.localStorage.getItem('locale');
  if (stored && SUPPORTED_LOCALES.has(stored as SupportedLocale)) {
    return stored as SupportedLocale;
  }
  const browser = window.navigator.language.toLowerCase();
  if (browser.startsWith('uz')) return 'uz' as SupportedLocale;
  if (browser.startsWith('ru')) return 'ru' as SupportedLocale;
  return appConfig.i18n.defaultLocale as SupportedLocale;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('profile');
  try { window.dispatchEvent(new Event('auth-changed')); } catch {}
}

let refreshInFlight: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (refreshInFlight) return refreshInFlight;
  const refresh = getRefreshToken();
  if (!refresh) return null;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.access) {
        localStorage.setItem('access_token', data.access);
        try { window.dispatchEvent(new Event('auth-changed')); } catch {}
        return data.access as string;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function apiFetch(path: string, opts: RequestInit = {}, isJson = true) {
  const doFetch = async () => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = API_TIMEOUT ? setTimeout(() => controller?.abort(), API_TIMEOUT) : undefined;
    const headers: Record<string, string> = {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers as Record<string, string> | undefined),
    };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      return await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers,
        credentials: 'omit',
        signal: opts.signal ?? controller?.signal,
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  let res = await doFetch();
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch();
    } else {
      clearAuth();
      throw new Error('Please sign in again');
    }
  }
  if (!res.ok) {
    let detail = '';
    try { const j = await res.json(); detail = j.detail || JSON.stringify(j); } catch {}
    if (res.status === 401) detail = 'Unauthorized';
    throw new Error(`API ${res.status}: ${detail || res.statusText}`);
  }
  if (!isJson) return res;
  return res.json();
}

export function absolutizeUrl(url: string): string {
  if (!url) return url;
  const low = url.toLowerCase();
  if (low.startsWith('http://') || low.startsWith('https://')) return url;
  const base = API_BASE.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}
