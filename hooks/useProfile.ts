/**
 * Hook for managing user profile
 */

import { useState, useCallback } from 'react';
import { UserProfile, UpdateProfilePayload } from '@/domain/models/UserProfile';
import { GetProfileUseCase } from '@/domain/usecases/profile/GetProfileUseCase';
import { UpdateProfileUseCase } from '@/domain/usecases/profile/UpdateProfileUseCase';
import { DeleteAccountUseCase } from '@/domain/usecases/profile/DeleteAccountUseCase';
import { ProfileRepositoryImpl } from '@/data/repositories/ProfileRepositoryImpl';

// Singleton instances
const profileRepository = new ProfileRepositoryImpl();
const getProfileUseCase = new GetProfileUseCase(profileRepository);
const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
const deleteAccountUseCase = new DeleteAccountUseCase(profileRepository);

export interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserProfile>;
  deleteAccount: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProfileUseCase.execute();
      setProfile(result);
    } catch (err: any) {
      const message = err?.message || 'Failed to load profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateProfileUseCase.execute(payload);
      setProfile(result);
      return result;
    } catch (err: any) {
      const message = err?.message || 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteAccountUseCase.execute();
      setProfile(null);
    } catch (err: any) {
      const message = err?.message || 'Failed to delete account';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    deleteAccount,
  };
}
