/**
 * Implementation of IProfileRepository using API Gateway
 */

import { IProfileRepository } from '@/domain/repositories/IProfileRepository';
import { UserProfile, UpdateProfilePayload } from '@/domain/models/UserProfile';
import { ProfileMapper } from '../mappers/ProfileMapper';
import { apiFetch } from '@/lib/apiUtils';
import { ProfileDTO } from '../models/ProfileDTO';

export class ProfileRepositoryImpl implements IProfileRepository {
  async getProfile(): Promise<UserProfile> {
    const dto: ProfileDTO = await apiFetch('/api/v1/me');
    return ProfileMapper.toDomain(dto);
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const formData = new FormData();

    if (payload.displayName !== undefined) {
      formData.append('display_name', payload.displayName);
    }
    if (payload.location !== undefined) {
      formData.append('location', payload.location === null ? '' : String(payload.location));
    }
    if (payload.logo) {
      formData.append('logo', payload.logo);
    }
    if (payload.banner) {
      formData.append('banner', payload.banner);
    }

    const dto: ProfileDTO = await apiFetch(
      '/api/v1/profile',
      {
        method: 'PATCH',
        body: formData,
      },
      false // Don't add Content-Type header (FormData sets it automatically)
    );

    return ProfileMapper.toDomain(dto);
  }

  async deleteAccount(): Promise<void> {
    await apiFetch('/api/v1/profile/delete', {
      method: 'DELETE',
    });

    // Clear local storage after successful deletion
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('profile');
      try {
        window.dispatchEvent(new Event('auth-changed'));
      } catch {}
    }
  }

  async markActive(): Promise<Date | null> {
    const result = await apiFetch('/api/v1/profile/active', {
      method: 'POST',
    });
    const value = result?.last_active_at;
    return value ? new Date(value) : null;
  }
}
