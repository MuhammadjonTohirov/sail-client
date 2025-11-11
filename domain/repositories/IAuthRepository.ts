import { AuthToken, TokenRefreshResult } from '../models/AuthToken';

export interface IAuthRepository {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(tokens: AuthToken): void;
  refreshAccessToken(): Promise<TokenRefreshResult | null>;
  clearAuth(): void;
}
