import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthToken, AuthResult, OtpRequestResult, SecurityInfo, TelegramAuthData, TokenRefreshResult } from '../../domain/models/AuthToken';
import { AuthMapper } from '../mappers/AuthMapper';
import { Auth } from '../../lib/authApi';
import {
  getToken,
  getRefreshToken,
  clearAuth as clearAuthUtils,
  refreshAccessToken as refreshTokenUtils,
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
    try { window.dispatchEvent(new Event('auth-changed')); } catch {}
  }

  async refreshAccessToken(): Promise<TokenRefreshResult | null> {
    const result = await refreshTokenUtils();
    if (!result) return null;
    return { accessToken: result, success: true };
  }

  clearAuth(): void {
    clearAuthUtils();
  }

  async login(login: string, password: string): Promise<AuthResult> {
    const dto = await Auth.login(login, password);
    return AuthMapper.authResponseToDomain(dto);
  }

  async register(login: string, password: string, displayName?: string): Promise<OtpRequestResult> {
    const dto = await Auth.register(login, password, displayName);
    return { status: dto.status, debugCode: dto.debug_code };
  }

  async registerVerify(login: string, code: string, password: string, displayName?: string): Promise<AuthResult> {
    const dto = await Auth.registerVerify(login, code, password, displayName);
    return AuthMapper.authResponseToDomain(dto);
  }

  async requestOtp(phone: string): Promise<OtpRequestResult> {
    const dto = await Auth.requestOtp(phone);
    return { status: dto.status, debugCode: dto.debug_code };
  }

  async verifyOtp(phone: string, code: string): Promise<AuthResult> {
    const dto = await Auth.verifyOtp(phone, code);
    return AuthMapper.authResponseToDomain(dto);
  }

  async telegramAuth(data: TelegramAuthData): Promise<AuthResult> {
    const telegramDTO = AuthMapper.telegramAuthDataToDTO(data);
    const dto = await Auth.telegram(telegramDTO);
    return AuthMapper.authResponseToDomain(dto);
  }

  async forgotPassword(login: string): Promise<void> {
    await Auth.forgotPassword(login);
  }

  async resetPassword(login: string, code: string, password: string): Promise<void> {
    await Auth.resetPassword(login, code, password);
  }

  async getSecurityInfo(): Promise<SecurityInfo> {
    const dto = await Auth.getSecurityInfo();
    return AuthMapper.securityInfoToDomain(dto);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await Auth.changePassword(currentPassword, newPassword);
  }

  async setPassword(newPassword: string): Promise<void> {
    await Auth.setPassword(newPassword);
  }

  async linkTelegram(data: TelegramAuthData): Promise<void> {
    const telegramDTO = AuthMapper.telegramAuthDataToDTO(data);
    await Auth.linkTelegram(telegramDTO);
  }

  async unlinkTelegram(): Promise<void> {
    await Auth.unlinkTelegram();
  }
}
