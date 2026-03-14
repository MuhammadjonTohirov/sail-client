import { apiFetch } from './apiUtils';
import type {
  AuthResponseDTO,
  ChangePasswordResponseDTO,
  ForgotPasswordResponseDTO,
  LinkTelegramResponseDTO,
  OtpRequestResponseDTO,
  ResetPasswordResponseDTO,
  SecurityInfoDTO,
  SetPasswordResponseDTO,
  TelegramAuthDataDTO,
  TelegramChatDTO,
  UnlinkTelegramResponseDTO,
  VerifyChatsResponseDTO,
} from '@/data/models/AuthDTO';
import type { ProfileDTO } from '@/data/models/ProfileDTO';

function persistAuth(data: AuthResponseDTO): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('profile', JSON.stringify(data.profile));
  try { window.dispatchEvent(new Event('auth-changed')); } catch {}
}

export const Auth = {
  requestOtp: (phone: string): Promise<OtpRequestResponseDTO> =>
    apiFetch('/api/v1/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: async (phone: string, code: string): Promise<AuthResponseDTO> => {
    const data: AuthResponseDTO = await apiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
    persistAuth(data);
    return data;
  },

  register: (login: string, password: string, displayName?: string): Promise<OtpRequestResponseDTO> =>
    apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ login, password, display_name: displayName }),
    }),

  registerVerify: async (login: string, code: string, password: string, displayName?: string): Promise<AuthResponseDTO> => {
    const data: AuthResponseDTO = await apiFetch('/api/v1/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify({ login, code, password, display_name: displayName }),
    });
    persistAuth(data);
    return data;
  },

  login: async (login: string, password: string): Promise<AuthResponseDTO> => {
    const data: AuthResponseDTO = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
    persistAuth(data);
    return data;
  },

  forgotPassword: (login: string): Promise<ForgotPasswordResponseDTO> =>
    apiFetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ login }),
    }),

  resetPassword: (login: string, code: string, password: string): Promise<ResetPasswordResponseDTO> =>
    apiFetch('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ login, code, password }),
    }),

  telegram: async (telegramData: TelegramAuthDataDTO): Promise<AuthResponseDTO> => {
    const data: AuthResponseDTO = await apiFetch('/api/v1/auth/telegram', {
      method: 'POST',
      body: JSON.stringify(telegramData),
    });
    persistAuth(data);
    return data;
  },

  me: (): Promise<ProfileDTO> => apiFetch('/api/v1/me'),

  updateProfile: async (payload: { display_name?: string; email?: string; location?: number | null; logo?: File; banner?: File }): Promise<Response> => {
    const formData = new FormData();
    if (payload.display_name !== undefined) formData.append('display_name', payload.display_name);
    if (payload.email !== undefined) formData.append('email', payload.email);
    if (payload.location !== undefined) formData.append('location', payload.location === null ? '' : String(payload.location));
    if (payload.logo) formData.append('logo', payload.logo);
    if (payload.banner) formData.append('banner', payload.banner);
    return apiFetch('/api/v1/profile', { method: 'PATCH', body: formData }, false);
  },

  deleteAccount: async (): Promise<void> => {
    await apiFetch('/api/v1/profile/delete', { method: 'DELETE' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('profile');
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('profile');
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
  },

  getTelegramChats: (): Promise<TelegramChatDTO[]> =>
    apiFetch('/api/v1/telegram-chats/'),

  disconnectTelegramChat: (chatId: string): Promise<void> =>
    apiFetch(`/api/v1/telegram-chats/${chatId}/`, { method: 'DELETE' }),

  verifyTelegramChats: (): Promise<VerifyChatsResponseDTO> =>
    apiFetch('/api/v1/telegram-chats/verify/', { method: 'POST' }),

  getSecurityInfo: (): Promise<SecurityInfoDTO> =>
    apiFetch('/api/v1/security'),

  changePassword: (currentPassword: string, newPassword: string): Promise<ChangePasswordResponseDTO> =>
    apiFetch('/api/v1/security/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),

  setPassword: (newPassword: string): Promise<SetPasswordResponseDTO> =>
    apiFetch('/api/v1/security/set-password', {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    }),

  linkTelegram: async (telegramData: TelegramAuthDataDTO): Promise<LinkTelegramResponseDTO> => {
    const data: LinkTelegramResponseDTO = await apiFetch('/api/v1/security/link-telegram', {
      method: 'POST',
      body: JSON.stringify(telegramData),
    });
    if (typeof window !== 'undefined' && data.profile) {
      localStorage.setItem('profile', JSON.stringify(data.profile));
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },

  unlinkTelegram: async (): Promise<UnlinkTelegramResponseDTO> => {
    const data: UnlinkTelegramResponseDTO = await apiFetch('/api/v1/security/unlink-telegram', {
      method: 'POST',
    });
    if (typeof window !== 'undefined' && data.profile) {
      localStorage.setItem('profile', JSON.stringify(data.profile));
      try { window.dispatchEvent(new Event('auth-changed')); } catch {}
    }
    return data;
  },
};
