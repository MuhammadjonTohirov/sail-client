import { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthToken, AuthResult, OtpRequestResult, SecurityInfo, TelegramAuthData } from '@/domain/models/AuthToken';
import { GetAccessTokenUseCase } from '@/domain/usecases/auth/GetAccessTokenUseCase';
import { SaveTokensUseCase } from '@/domain/usecases/auth/SaveTokensUseCase';
import { RefreshTokenUseCase } from '@/domain/usecases/auth/RefreshTokenUseCase';
import { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase';
import { LoginUseCase } from '@/domain/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@/domain/usecases/auth/RegisterUseCase';
import { RegisterVerifyUseCase } from '@/domain/usecases/auth/RegisterVerifyUseCase';
import { RequestOtpUseCase } from '@/domain/usecases/auth/RequestOtpUseCase';
import { VerifyOtpUseCase } from '@/domain/usecases/auth/VerifyOtpUseCase';
import { TelegramAuthUseCase } from '@/domain/usecases/auth/TelegramAuthUseCase';
import { ForgotPasswordUseCase } from '@/domain/usecases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '@/domain/usecases/auth/ResetPasswordUseCase';
import { GetSecurityInfoUseCase } from '@/domain/usecases/auth/GetSecurityInfoUseCase';
import { ChangePasswordUseCase } from '@/domain/usecases/auth/ChangePasswordUseCase';
import { SetPasswordUseCase } from '@/domain/usecases/auth/SetPasswordUseCase';
import { LinkTelegramUseCase } from '@/domain/usecases/auth/LinkTelegramUseCase';
import { UnlinkTelegramUseCase } from '@/domain/usecases/auth/UnlinkTelegramUseCase';
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
  const loginUseCase = useMemo(() => new LoginUseCase(repository), [repository]);
  const registerUseCase = useMemo(() => new RegisterUseCase(repository), [repository]);
  const registerVerifyUseCase = useMemo(() => new RegisterVerifyUseCase(repository), [repository]);
  const requestOtpUseCase = useMemo(() => new RequestOtpUseCase(repository), [repository]);
  const verifyOtpUseCase = useMemo(() => new VerifyOtpUseCase(repository), [repository]);
  const telegramAuthUseCase = useMemo(() => new TelegramAuthUseCase(repository), [repository]);
  const forgotPasswordUseCase = useMemo(() => new ForgotPasswordUseCase(repository), [repository]);
  const resetPasswordUseCase = useMemo(() => new ResetPasswordUseCase(repository), [repository]);
  const getSecurityInfoUseCase = useMemo(() => new GetSecurityInfoUseCase(repository), [repository]);
  const changePasswordUseCase = useMemo(() => new ChangePasswordUseCase(repository), [repository]);
  const setPasswordUseCase = useMemo(() => new SetPasswordUseCase(repository), [repository]);
  const linkTelegramUseCase = useMemo(() => new LinkTelegramUseCase(repository), [repository]);
  const unlinkTelegramUseCase = useMemo(() => new UnlinkTelegramUseCase(repository), [repository]);

  const checkAuth = useCallback(() => {
    const token = getTokenUseCase.execute();
    setIsAuthenticated(!!token);
    return !!token;
  }, [getTokenUseCase]);

  useEffect(() => {
    checkAuth();
    const handleAuthChange = () => checkAuth();
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
      setError(err instanceof Error ? err.message : 'Failed to save tokens');
      throw err;
    }
  }, [saveTokensUseCase]);

  const refreshToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await refreshTokenUseCase.execute();
      if (result?.success) {
        setIsAuthenticated(true);
        return result.accessToken;
      }
      setIsAuthenticated(false);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh token');
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
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  }, [logoutUseCase]);

  const login = useCallback(async (loginStr: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await loginUseCase.execute(loginStr, password);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loginUseCase]);

  const register = useCallback(async (loginStr: string, password: string, displayName?: string): Promise<OtpRequestResult> => {
    try {
      setLoading(true);
      setError(null);
      return await registerUseCase.execute(loginStr, password, displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [registerUseCase]);

  const registerVerify = useCallback(async (loginStr: string, code: string, password: string, displayName?: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await registerVerifyUseCase.execute(loginStr, code, password, displayName);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [registerVerifyUseCase]);

  const requestOtp = useCallback(async (phone: string): Promise<OtpRequestResult> => {
    try {
      setLoading(true);
      setError(null);
      return await requestOtpUseCase.execute(phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requestOtpUseCase]);

  const verifyOtp = useCallback(async (phone: string, code: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await verifyOtpUseCase.execute(phone, code);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [verifyOtpUseCase]);

  const telegramAuth = useCallback(async (data: TelegramAuthData): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await telegramAuthUseCase.execute(data);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Telegram auth failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [telegramAuthUseCase]);

  const forgotPassword = useCallback(async (loginStr: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await forgotPasswordUseCase.execute(loginStr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Forgot password failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [forgotPasswordUseCase]);

  const resetPassword = useCallback(async (loginStr: string, code: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await resetPasswordUseCase.execute(loginStr, code, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resetPasswordUseCase]);

  const getSecurityInfo = useCallback(async (): Promise<SecurityInfo> => {
    try {
      setLoading(true);
      setError(null);
      return await getSecurityInfoUseCase.execute();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get security info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getSecurityInfoUseCase]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await changePasswordUseCase.execute(currentPassword, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [changePasswordUseCase]);

  const setPassword = useCallback(async (newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await setPasswordUseCase.execute(newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Set password failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setPasswordUseCase]);

  const linkTelegram = useCallback(async (data: TelegramAuthData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await linkTelegramUseCase.execute(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Link Telegram failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [linkTelegramUseCase]);

  const unlinkTelegram = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await unlinkTelegramUseCase.execute();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unlink Telegram failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [unlinkTelegramUseCase]);

  return {
    isAuthenticated,
    loading,
    error,
    getAccessToken,
    saveTokens,
    refreshToken,
    logout,
    checkAuth,
    login,
    register,
    registerVerify,
    requestOtp,
    verifyOtp,
    telegramAuth,
    forgotPassword,
    resetPassword,
    getSecurityInfo,
    changePassword,
    setPassword,
    linkTelegram,
    unlinkTelegram,
  };
}
