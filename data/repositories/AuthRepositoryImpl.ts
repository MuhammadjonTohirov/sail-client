import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthToken, TokenRefreshResult } from '../../domain/models/AuthToken';
import { TokenRefreshResponseDTO } from '../models/AuthDTO';
import { AuthMapper } from '../mappers/AuthMapper';
import {
  getToken,
  getRefreshToken,
  clearAuth as clearAuthUtils,
  refreshAccessToken as refreshTokenUtils,
  API_BASE
} from '../../lib/apiUtils';

export class AuthRepositoryImpl implements IAuthRepository {
  getAccessToken(): string | null {
    return getToken();
  }

  getRefreshToken(): string | null {
    return getRefreshToken();
  }

  saveTokens(tokens: AuthToken): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);

    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
  }

  async refreshAccessToken(): Promise<TokenRefreshResult | null> {
    const result = await refreshTokenUtils();

    if (!result) {
      return null;
    }

    return {
      accessToken: result,
      success: true,
    };
  }

  clearAuth(): void {
    clearAuthUtils();
  }
}
