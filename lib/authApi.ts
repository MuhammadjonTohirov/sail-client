import { apiFetch } from './apiUtils';

export const Auth = {
  // Legacy OTP-only flow
  requestOtp: (phone: string) =>
    apiFetch('/api/v1/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone })
    }),

  verifyOtp: async (phone: string, code: string) => {
    const data = await apiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code })
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('profile', JSON.stringify(data.profile));
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },

  // New password-based flows
  register: (login: string, password: string, displayName?: string) =>
    apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
        display_name: displayName
      })
    }),

  registerVerify: async (login: string, code: string, password: string, displayName?: string) => {
    const data = await apiFetch('/api/v1/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify({
        login,
        code,
        password,
        display_name: displayName
      })
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('profile', JSON.stringify(data.profile));
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },

  login: async (login: string, password: string) => {
    const data = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('profile', JSON.stringify(data.profile));
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },

  forgotPassword: (login: string) =>
    apiFetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ login })
    }),

  resetPassword: (login: string, code: string, password: string) =>
    apiFetch('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ login, code, password })
    }),

  me: () => apiFetch('/api/v1/me'),

  updateProfile: async (data: { display_name?: string; email?: string; location?: number | null; logo?: File; banner?: File }) => {
    const formData = new FormData();

    if (data.display_name !== undefined) {
      formData.append('display_name', data.display_name);
    }
    if (data.email !== undefined) {
      formData.append('email', data.email);
    }
    if (data.location !== undefined) {
      formData.append('location', data.location === null ? '' : String(data.location));
    }
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    if (data.banner) {
      formData.append('banner', data.banner);
    }

    return apiFetch('/api/v1/profile', {
      method: 'PATCH',
      body: formData,
    }, false); // false = don't add Content-Type header (FormData sets it automatically)
  },

  deleteAccount: async () => {
    const result = await apiFetch('/api/v1/profile/delete', {
      method: 'DELETE'
    });
    // Clear local storage after successful deletion
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('profile');
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return result;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('profile');
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
  },
};
