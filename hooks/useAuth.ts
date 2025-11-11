import { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthToken } from '@/domain/models/AuthToken';
import { GetAccessTokenUseCase } from '@/domain/usecases/auth/GetAccessTokenUseCase';
import { SaveTokensUseCase } from '@/domain/usecases/auth/SaveTokensUseCase';
import { RefreshTokenUseCase } from '@/domain/usecases/auth/RefreshTokenUseCase';
import { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new AuthRepositoryImpl(), []);
  const getTokenUseCase = useMemo(() => new GetAccessTokenUseCase(repository), [repository]);
  const saveTokensUseCase = useMemo(() => new SaveTokensUseCase(repository), [repository]);
  const refreshTokenUseCase = useMemo(() => new RefreshTokenUseCase(repository), [repository]);
  const logoutUseCase = useMemo(() => new LogoutUseCase(repository), [repository]);

  const checkAuth = useCallback(() => {
    const token = getTokenUseCase.execute();
    setIsAuthenticated(!!token);
    return !!token;
  }, [getTokenUseCase]);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-changed', handleAuthChange);
      return () => window.removeEventListener('auth-changed', handleAuthChange);
    }
  }, [checkAuth]);

  const getAccessToken = useCallback(() => {
    return getTokenUseCase.execute();
  }, [getTokenUseCase]);

  const saveTokens = useCallback((tokens: AuthToken) => {
    try {
      setError(null);
      saveTokensUseCase.execute(tokens);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save tokens';
      setError(errorMessage);
      throw err;
    }
  }, [saveTokensUseCase]);

  const refreshToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await refreshTokenUseCase.execute();

      if (result && result.success) {
        setIsAuthenticated(true);
        return result.accessToken;
      } else {
        setIsAuthenticated(false);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh token';
      setError(errorMessage);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshTokenUseCase]);

  const logout = useCallback(() => {
    try {
      setError(null);
      logoutUseCase.execute();
      setIsAuthenticated(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
    }
  }, [logoutUseCase]);

  return {
    isAuthenticated,
    loading,
    error,
    getAccessToken,
    saveTokens,
    refreshToken,
    logout,
    checkAuth,
  };
}
