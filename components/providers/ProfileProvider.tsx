"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProfileRepositoryImpl } from "@/data/repositories/ProfileRepositoryImpl";
import type {
  UpdateProfilePayload,
  UserProfile,
} from "@/domain/models/UserProfile";
import { GetProfileUseCase } from "@/domain/usecases/profile/GetProfileUseCase";
import { UpdateProfileUseCase } from "@/domain/usecases/profile/UpdateProfileUseCase";
import { DeleteAccountUseCase } from "@/domain/usecases/profile/DeleteAccountUseCase";

type ProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserProfile>;
  deleteAccount: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function persistProfile(profile: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
  } else {
    localStorage.removeItem("profile");
  }
}

function readProfileFromStorage(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("profile");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const tokenRef = React.useRef<string | null>(null);

  useEffect(() => {
    setProfile(readProfileFromStorage());
  }, []);

  const repository = useMemo(() => new ProfileRepositoryImpl(), []);
  const getProfileUseCase = useMemo(
    () => new GetProfileUseCase(repository),
    [repository]
  );
  const updateProfileUseCase = useMemo(
    () => new UpdateProfileUseCase(repository),
    [repository]
  );
  const deleteAccountUseCase = useMemo(
    () => new DeleteAccountUseCase(repository),
    [repository]
  );

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProfileUseCase.execute();
      setProfile(result);
      persistProfile(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
      setProfile(null);
      persistProfile(null);
    } finally {
      setLoading(false);
    }
  }, [getProfileUseCase]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateProfileUseCase.execute(payload);
        setProfile(result);
        persistProfile(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateProfileUseCase]
  );

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteAccountUseCase.execute();
      setProfile(null);
      persistProfile(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete account"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteAccountUseCase]);

  useEffect(() => {
    const token =
      typeof window === "undefined" ? null : localStorage.getItem("access_token");
    tokenRef.current = token;
    if (token) {
      getProfile().finally(() => setInitialized(true));
    } else {
      setProfile(null);
      setInitialized(true);
    }
  }, [getProfile]);

  useEffect(() => {
    const onAuthChanged = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("access_token");
      if (token) {
        if (tokenRef.current === token && profile) {
          return;
        }
        tokenRef.current = token;
        getProfile();
      } else {
        tokenRef.current = null;
        setProfile(null);
        persistProfile(null);
      }
    };
    window.addEventListener("auth-changed", onAuthChanged as EventListener);
    return () => {
      window.removeEventListener(
        "auth-changed",
        onAuthChanged as EventListener
      );
    };
  }, [getProfile, profile]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      getProfile,
      updateProfile,
      deleteAccount,
    }),
    [profile, loading, error, getProfile, updateProfile, deleteAccount]
  );

  return (
    <ProfileContext.Provider value={value}>
      {initialized ? children : null}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
