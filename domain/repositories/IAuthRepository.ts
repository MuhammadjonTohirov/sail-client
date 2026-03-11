import { AuthToken, AuthResult, OtpRequestResult, SecurityInfo, TelegramAuthData, TokenRefreshResult } from '../models/AuthToken';

export interface IAuthRepository {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(tokens: AuthToken): void;
  refreshAccessToken(): Promise<TokenRefreshResult | null>;
  clearAuth(): void;

  login(login: string, password: string): Promise<AuthResult>;
  register(login: string, password: string, displayName?: string): Promise<OtpRequestResult>;
  registerVerify(login: string, code: string, password: string, displayName?: string): Promise<AuthResult>;
  requestOtp(phone: string): Promise<OtpRequestResult>;
  verifyOtp(phone: string, code: string): Promise<AuthResult>;
  telegramAuth(data: TelegramAuthData): Promise<AuthResult>;

  forgotPassword(login: string): Promise<void>;
  resetPassword(login: string, code: string, password: string): Promise<void>;

  getSecurityInfo(): Promise<SecurityInfo>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  setPassword(newPassword: string): Promise<void>;
  linkTelegram(data: TelegramAuthData): Promise<void>;
  unlinkTelegram(): Promise<void>;
}
